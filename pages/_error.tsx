/**
 * We need to fetch some data in order to show a layout for 404 page.
 * That is why generic component was created, because neither `getServerSideProps`
 * nor `getInitialProps` are supported by Next.js for 404.txt and 500.tsx pages.
 */

import * as Sentry from '@sentry/nextjs';
import { NextPage, NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import NextError, { ErrorProps } from 'next/error';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { DEFAULT_LOCALE, importMessages } from '@/utils';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, Translations } from 'types';

const InternalServerError = dynamic(() => import('@/modules/Errors/InternalServerError'), {
    ssr: true,
});
const NotFound = dynamic(() => import('@/modules/Errors/NotFound'), { ssr: true });

enum StatusCode {
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

type ErrorPropsWithExtraSentryProps = ErrorProps & {
    hasGetInitialPropsRun: boolean;
    error?: Error | null;
};

type NotFoundProps = {
    statusCode: StatusCode.NOT_FOUND;
    translations: Translations;
} & BasePageProps;
type InternalServerErrorProps = {
    statusCode: StatusCode.INTERNAL_SERVER_ERROR;
    translations?: Translations;
};
type Props = ErrorPropsWithExtraSentryProps & (NotFoundProps | InternalServerErrorProps);

const ErrorPage: NextPage<Props> = (props) => {
    const { error, hasGetInitialPropsRun } = props;
    if (!hasGetInitialPropsRun && error) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        Sentry.captureException(error);
        // Flushing is not required in this case as it only happens on the client
    }

    const { statusCode } = props;

    if (statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        const { translations } = props;

        // If translations fail to load we display the vanilla NextJS error component
        if (!translations) {
            return <NextError statusCode={statusCode} />;
        }

        return (
            <IntlProvider
                locale={DEFAULT_LOCALE}
                defaultLocale={DEFAULT_LOCALE}
                messages={translations}
            >
                <InternalServerError />
            </IntlProvider>
        );
    }

    if (statusCode === StatusCode.NOT_FOUND) {
        const {
            categories,
            companyInformation,
            languages,
            localeCode,
            newsroom,
            translations,
            themePreset,
            algoliaSettings,
        } = props;

        return (
            <NewsroomContextProvider
                categories={categories}
                companyInformation={companyInformation}
                newsroom={newsroom}
                languages={languages}
                localeCode={localeCode}
                translations={translations}
                themePreset={themePreset}
                algoliaSettings={algoliaSettings}
                hasError
            >
                <NotFound />
            </NewsroomContextProvider>
        );
    }

    return <NextError statusCode={statusCode} />;
};

// TODO: This seems to trigger on client side sometimes, which causes crashing
ErrorPage.getInitialProps = async (context: NextPageContext): Promise<Props> => {
    const { req: request, res: response, err: error, asPath, locale } = context;

    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // getInitialProps has run
    const baseInitialProps = {
        ...(await NextError.getInitialProps(context)),
        hasGetInitialPropsRun: true,
        error,
    };

    const statusCode: StatusCode = response?.statusCode || error?.statusCode || 404;

    let extraInitialProps: NotFoundProps | InternalServerErrorProps;
    if (statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        extraInitialProps = { statusCode } as InternalServerErrorProps;

        // The translations still can fail to load, hence the catch block
        try {
            const translations = await importMessages(DEFAULT_LOCALE);
            extraInitialProps.translations = translations;
        } catch (_) {
            // NOOP
        }
    } else {
        const api = getPrezlyApi(request);
        const basePageProps = await api.getBasePageProps(request, locale);
        const translations = await importMessages(basePageProps.localeCode);

        extraInitialProps = { ...basePageProps, statusCode, translations } as NotFoundProps;
    }

    // Running on the server, the response object (`res`) is available.
    //
    // Next.js will pass an err on the server if a page's data fetching methods
    // threw or returned a Promise that rejected
    //
    // Running on the client (browser), Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    componentDidMount, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html

    if (error && statusCode !== StatusCode.NOT_FOUND) {
        Sentry.captureException(error);

        // Flushing before returning is necessary if deploying to Vercel, see
        // https://vercel.com/docs/platform/limits#streaming-responses
        await Sentry.flush(2000);

        return { ...baseInitialProps, ...extraInitialProps };
    }

    // No need to trigger a Sentry error if user lands on 404
    if (statusCode !== StatusCode.NOT_FOUND) {
        // If this point is reached, getInitialProps was called without any
        // information about what the error might be. This is unexpected and may
        // indicate a bug introduced in Next.js, so record it in Sentry
        Sentry.captureException(
            new Error(`_error.js getInitialProps missing data at path: ${asPath}`),
        );
        await Sentry.flush(2000);
    }

    return { ...baseInitialProps, ...extraInitialProps };
};

export default ErrorPage;
