import { Category as CategoryType } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { getRedirectToCanonicalLocale } from '@/utils/locale';
import { getPrezlyApi } from '@/utils/prezly';
import { DEFAULT_PAGE_SIZE } from '@/utils/prezly/constants';
import { BasePageProps, PaginationProps, StoryWithImage } from 'types';

const Category = dynamic(() => import('@/modules/Category'));

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    category: CategoryType;
    pagination: PaginationProps;
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
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        selectedCategory={category}
    >
        <Category category={category} stories={stories} pagination={pagination} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const { slug } = context.params as { slug: string };

    const category = await api.getCategoryBySlug(slug);

    if (!category) {
        return {
            notFound: true,
        };
    }

    const basePageProps = await api.getBasePageProps(context.locale);

    if (!basePageProps.localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(
        basePageProps,
        context.locale,
        `/category/${slug}`,
    );
    if (redirect) {
        return { redirect };
    }

    const page =
        context.query.page && typeof context.query.page === 'string'
            ? Number(context.query.page)
            : undefined;

    const { stories, storiesTotal } = await api.getStoriesFromCategory(category, {
        page,
        include: ['header_image', 'preview_image'],
        localeCode: basePageProps.localeCode,
    });

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
        },
    };
};

export default IndexPage;
