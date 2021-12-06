import type { ExtendedStory } from '@prezly/sdk';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

interface Props extends BasePageProps {
    story: ExtendedStory;
}

const StoryPreviewPage: NextPage<Props> = ({
    story,
    categories,
    newsroom,
    companyInformation,
    languages,
    locale,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        locale={locale}
        selectedStory={story}
        isTrackingEnabled={false}
    >
        <Story story={story} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const { uuid } = context.params as { uuid: string };

    try {
        const story = await api.getStory(uuid);
        const basePageProps = await api.getBasePageProps(context.locale, story);

        return {
            props: {
                ...basePageProps,
                story,
            },
        };
    } catch (error) {
        // Log the error into NextJS console
        // eslint-disable-next-line no-console
        console.error(error);

        return {
            notFound: true,
        };
    }
};

export default StoryPreviewPage;
