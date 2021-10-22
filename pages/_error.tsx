import { Category, Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import { NextPage, NextPageContext } from 'next';
import React, { ComponentType } from 'react';

import Layout from '@/components/Layout';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { Error404, Error500 } from '@/modules/Errors';
import { getPrezlyApi } from '@/utils/prezly';

type StatusCode = number;

interface Props {
    categories: Category[];
    companyInformation: NewsroomCompanyInformation;
    newsroom: Newsroom;
    statusCode: StatusCode;
}

const ERROR_COMPONENTS: Record<StatusCode, ComponentType> = {
    404: Error404,
    500: Error500,
};

const shouldRenderLayout = (statusCode: StatusCode): boolean => statusCode === 404;

const ErrorPage: NextPage<Props> = ({ categories, companyInformation, newsroom, statusCode }) => {
    const ErrorComponent = ERROR_COMPONENTS[statusCode];

    if (shouldRenderLayout(statusCode)) {
        return (
            <NewsroomContextProvider
                categories={categories}
                companyInformation={companyInformation}
                newsroom={newsroom}
            >
                <Layout>
                    <ErrorComponent />
                </Layout>
            </NewsroomContextProvider>
        );
    }

    return <ErrorComponent />;
};

ErrorPage.getInitialProps = async ({
    req: request,
    res: response,
    err: error,
}: NextPageContext): Promise<Props> => {
    const api = getPrezlyApi(request);
    const statusCode = response?.statusCode || error?.statusCode || 404;

    const [categories, companyInformation, newsroom] = await Promise.all([
        api.getCategories(),
        api.getCompanyInformation(),
        api.getNewsroom(),
    ]);

    return { categories, companyInformation, newsroom, statusCode };
};

export default ErrorPage;
