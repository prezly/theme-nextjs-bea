import { Category, Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import { NextPage, NextPageContext } from 'next';
import React from 'react';

import Layout from '@/components/Layout';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { InternalServerError, NotFound } from '@/modules/Errors';
import { getPrezlyApi } from '@/utils/prezly';

enum StatusCode {
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

interface LayoutProps {
    categories: Category[];
    companyInformation: NewsroomCompanyInformation;
    newsroom: Newsroom;
}

type PropsNotFound = { statusCode: StatusCode.NOT_FOUND } & LayoutProps;
type PropsInternalServerError = { statusCode: StatusCode.INTERNAL_SERVER_ERROR };
type Props = PropsNotFound | PropsInternalServerError;

const ErrorPage: NextPage<Props> = (props) => {
    const { statusCode } = props;

    if (statusCode === StatusCode.NOT_FOUND) {
        const { categories, companyInformation, newsroom } = props as PropsNotFound;
        return (
            <NewsroomContextProvider
                categories={categories}
                companyInformation={companyInformation}
                newsroom={newsroom}
            >
                <Layout>
                    <NotFound />
                </Layout>
            </NewsroomContextProvider>
        );
    }

    return <InternalServerError />;
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
