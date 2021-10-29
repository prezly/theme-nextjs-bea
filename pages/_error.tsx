/**
 * We need to fetch some data in order to show a layout for 404 page.
 * That is why generic component was created, because neither `getServerSideProps`
 * nor `getInitialProps` are supported by Next.js for 404.txt and 500.tsx pages.
 */

import { NextPage, NextPageContext } from 'next';
import NextError from 'next/error';
import React from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { InternalServerError, NotFound } from '@/modules/Errors';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps } from 'types';

enum StatusCode {
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

type NotFoundProps = { statusCode: StatusCode.NOT_FOUND } & BasePageProps;
type InternalServerErrorProps = { statusCode: StatusCode.INTERNAL_SERVER_ERROR };
type Props = NotFoundProps | InternalServerErrorProps;

const ErrorPage: NextPage<Props> = (props) => {
    const { statusCode } = props;

    if (statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        return <InternalServerError />;
    }

    if (statusCode === StatusCode.NOT_FOUND) {
        const { categories, companyInformation, newsroom, newsroomLanguages } = props;

        return (
            <NewsroomContextProvider
                categories={categories}
                companyInformation={companyInformation}
                newsroom={newsroom}
                newsroomLanguages={newsroomLanguages}
            >
                <NotFound />
            </NewsroomContextProvider>
        );
    }

    return <NextError statusCode={statusCode} />;
};

ErrorPage.getInitialProps = async ({
    req: request,
    res: response,
    err: error,
}: NextPageContext): Promise<Props> => {
    const api = getPrezlyApi(request);
    const statusCode: StatusCode = response?.statusCode || error?.statusCode || 404;

    if (statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        return { statusCode };
    }

    const [categories, companyInformation, newsroom, newsroomLanguages] = await Promise.all([
        api.getCategories(),
        api.getCompanyInformation(),
        api.getNewsroom(),
        api.getNewsroomLanguages(),
    ]);

    return { categories, companyInformation, newsroom, newsroomLanguages, statusCode };
};

export default ErrorPage;
