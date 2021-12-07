import type { ExtendedStory } from '@prezly/sdk';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { importMessages } from '@/utils/lang';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, Translations } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

interface Props extends BasePageProps {
    story: ExtendedStory;
    translations: Translations;
}

const StoryPreviewPage: NextPage<Props> = ({
    story,
    categories,
    newsroom,
    companyInformation,
    languages,
    localeCode,
    translations,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        selectedStory={story}
        isTrackingEnabled={false}
        translations={translations}
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
        const translations = await importMessages(basePageProps.localeCode);

        return {
            props: {
                ...basePageProps,
                story,
                translations,
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
