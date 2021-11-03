/**
 * We need to fetch some data in order to show a layout for 404 page.
 * That is why generic component was created, because neither `getServerSideProps`
 * nor `getInitialProps` are supported by Next.js for 404.txt and 500.tsx pages.
 */

import { Category, Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import { NextPage, NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import NextError from 'next/error';
import React from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { getPrezlyApi } from '@/utils/prezly';

const InternalServerError = dynamic(() => import('@/modules/Errors/InternalServerError'), {
    ssr: true,
});
const NotFound = dynamic(() => import('@/modules/Errors/NotFound'), { ssr: true });

enum StatusCode {
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

interface LayoutProps {
    categories: Category[];
    companyInformation: NewsroomCompanyInformation;
    newsroom: Newsroom;
}

type NotFoundProps = { statusCode: StatusCode.NOT_FOUND } & LayoutProps;
type InternalServerErrorProps = { statusCode: StatusCode.INTERNAL_SERVER_ERROR };
type Props = NotFoundProps | InternalServerErrorProps;

const ErrorPage: NextPage<Props> = (props) => {
    const { statusCode } = props;

    if (statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        return <InternalServerError />;
    }

    if (statusCode === StatusCode.NOT_FOUND) {
        const { categories, companyInformation, newsroom } = props;

        return (
            <NewsroomContextProvider
                categories={categories}
                companyInformation={companyInformation}
                newsroom={newsroom}
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

    const [categories, companyInformation, newsroom] = await Promise.all([
        api.getCategories(),
        api.getCompanyInformation(),
        api.getNewsroom(),
    ]);

    return { categories, companyInformation, newsroom, statusCode };
};

export default ErrorPage;
