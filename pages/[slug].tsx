import type { ExtendedStory } from '@prezly/sdk/dist/types';
import { GetServerSideProps, NextPage } from 'next';
import { getPrezlyApi, withAuthorization } from '@/utils/prezly';
import Story from '@/modules/Story';
import Layout from '@/components/Layout';

type Props = {
    story: ExtendedStory;
};

const StoryPage: NextPage<Props> = ({ story }) => (
    <Layout>
        <Story story={story} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps = withAuthorization(async (context) => {
    const api = getPrezlyApi(context.req);
    const { slug } = context.params;
    const story = slug ? await api.getStoryBySlug(slug) : null;

    return {
        props: {
            story,
        },
    };
});

export default StoryPage;
