import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlySdk, withAuthorization } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';

type Props = {
    stories: Story[];
};

const IndexPage: FunctionComponent<Props> = ({ stories }) => (
    <Layout>
        <h1>Hello Prezly 👋</h1>
        <Stories stories={stories} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps<Props> = withAuthorization(async (context) => {
    const prezlySdk = getPrezlySdk(context.req);

    const { stories } = await prezlySdk.stories.list();

    return {
        props: { stories },
    };
});

export default IndexPage;
