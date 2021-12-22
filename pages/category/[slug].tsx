import type { Category as CategoryType } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { importMessages } from '@/utils/lang';
import { getRedirectToCanonicalLocale } from '@/utils/locale';
import { getPrezlyApi } from '@/utils/prezly';
import { DEFAULT_PAGE_SIZE } from '@/utils/prezly/constants';
import { BasePageProps, PaginationProps, StoryWithImage, Translations } from 'types';

const Category = dynamic(() => import('@/modules/Category'));

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    category: CategoryType;
    pagination: PaginationProps;
    translations: Translations;
}

const IndexPage: FunctionComponent<Props> = ({
    category,
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
        selectedCategory={category}
        translations={translations}
        themePreset={themePreset}
        algoliaSettings={algoliaSettings}
    >
        <Category category={category} stories={stories} pagination={pagination} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale, query } = context;

    const api = getPrezlyApi(request);
    const { slug } = context.params as { slug: string };

    const category = await api.getCategoryBySlug(slug);

    if (!category) {
        return {
            notFound: true,
        };
    }

    const basePageProps = await api.getBasePageProps(request, locale);

    if (!basePageProps.localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(basePageProps, locale, `/category/${slug}`);
    if (redirect) {
        return { redirect };
    }

    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

    const { stories, storiesTotal } = await api.getStoriesFromCategory(category, {
        page,
        include: ['header_image', 'preview_image'],
        localeCode: basePageProps.localeCode,
    });

    const translations = await importMessages(basePageProps.localeCode);

    return {
        props: {
            ...basePageProps,
            // TODO: This is temporary until return types from API are figured out
            stories: stories as StoryWithImage[],
            category,
            pagination: {
                itemsTotal: storiesTotal,
                currentPage: page ?? 1,
                pageSize: DEFAULT_PAGE_SIZE,
            },
            translations,
        },
    };
};

export default IndexPage;
