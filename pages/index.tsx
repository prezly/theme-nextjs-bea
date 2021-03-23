import type { FunctionComponent } from "react";
import type { Story } from "@prezly/sdk";
import { GetServerSideProps } from "next";
import { getEnvVariables, getPrezlySdk, withAuthorization } from "utils/prezly";
import Layout from "components/Layout";
import Stories from "modules/Stories";

type Props = {
    stories: Story[];
}

const IndexPage: FunctionComponent<Props> = ({ stories }) => (
    <Layout>
        <h1>Hello Prezly 👋</h1>
        <Stories stories={stories} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps<Props> = withAuthorization(async (context) => {
    const env = getEnvVariables(context.req);
    const prezlySdk = getPrezlySdk(context.req);

    const stories = (await prezlySdk.stories.list()).stories;

    return {
        props: { stories },
    };
});

export default IndexPage;
