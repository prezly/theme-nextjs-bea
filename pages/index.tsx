import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';
import { PageSeo } from '@/components/seo';
import getAssetsUrl from '@/utils/prezly/getAssetsUrl';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { BasePageProps } from 'types';

interface Props extends BasePageProps {
    stories: Story[];
}

const IndexPage: FunctionComponent<Props> = ({
    stories,
    categories,
    newsroom,
    companyInformation,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
    >
        <PageSeo
            title={newsroom.display_name}
            description=""
            url={newsroom.url}
            imageUrl={getAssetsUrl(newsroom.newsroom_logo?.uuid as string)}
        />
        <Layout>
            <h1>Hello Prezly 👋</h1>
            <Stories stories={stories} />
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const [stories, categories, newsroom, companyInformation] = await Promise.all([
        api.getStories(),
        api.getCategories(),
        api.getNewsroom(),
        api.getCompanyInformation(),
    ]);

    return {
        props: {
            stories,
            categories,
            newsroom,
            companyInformation,
        },
    };
};

export default IndexPage;
