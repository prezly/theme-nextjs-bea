import type { ExtendedStory } from '@prezly/sdk/dist/types';
import { GetServerSideProps, NextPage } from 'next';
import { getPrezlySdk, withAuthorization } from 'utils/prezly';
import Story from 'modules/Story';
import Layout from 'components/Layout';

type Props = {
    story: ExtendedStory;
};

const StoryPage: NextPage<Props> = ({ story }) => (
    <Layout>
        <Story story={story} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps = withAuthorization(async (context) => {
    const prezlySdk = getPrezlySdk(context.req);

    const story = await prezlySdk.stories.get(Number(context.params!.id));

    return {
        props: {
            story,
        },
    };
});

export default StoryPage;
