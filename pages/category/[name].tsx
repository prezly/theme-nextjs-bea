import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi, withAuthorization } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';

type Props = {
    stories: Story[];
    categories?: Array<any>
};

const IndexPage: FunctionComponent<Props> = ({ category, stories }) => (
    <Layout>
        <h1>Hello Prezly 👋</h1>
        <Stories stories={stories} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps<Props> = withAuthorization(async (context) => {
    const api = getPrezlyApi(context.req);
    const { name } = context.params;
    const stories = await api.getAllStoriesFromCategory(name);

    return {
        props: { stories },
    };
});

export default IndexPage;
