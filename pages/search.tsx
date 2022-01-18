import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { importMessages } from '@/utils/lang';
import { getRedirectToCanonicalLocale } from '@/utils/locale';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, PaginationProps, StoryWithImage, Translations } from 'types';

const SearchPage = dynamic(() => import('@/modules/Search'), { ssr: true });

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    pagination: PaginationProps;
    translations: Translations;
}

const IndexPage: FunctionComponent<Props> = ({
    stories,
    categories,
    newsroom,
    companyInformation,
    languages,
    localeCode,
    pagination,
    translations,
    themePreset,
    algoliaSettings,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        translations={translations}
        themePreset={themePreset}
        algoliaSettings={algoliaSettings}
    >
        <SearchPage stories={stories} pagination={pagination} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale, query } = context;
    const api = getPrezlyApi(request);

    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;
    const searchQuery = query.query && typeof query.query === 'string' ? query.query : null;

    const basePageProps = await api.getBasePageProps(request, locale);
    const { localeResolved } = basePageProps;

    if (!localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(basePageProps, locale, '/search', query);
    if (redirect) {
        return { redirect };
    }

    // TODO: Get stories through Algolia when search query is set
    const storiesPaginated = await api.getStories({
        page,
        // TODO: Extract to a constant
        pageSize: 6,
        include: ['thumbnail_image'],
        localeCode: basePageProps.localeCode,
    });

    const { stories, storiesTotal } = storiesPaginated;
    const translations = await importMessages(basePageProps.localeCode);

    return {
        props: {
            ...basePageProps,
            // TODO: This is temporary until return types from API are figured out
            stories: searchQuery ? [] : (stories as StoryWithImage[]),
            pagination: {
                itemsTotal: searchQuery ? 0 : storiesTotal,
                currentPage: page ?? 1,
                pageSize: 6,
            },
            translations,
        },
    };
};

export default IndexPage;
