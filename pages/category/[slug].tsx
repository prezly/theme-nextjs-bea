import type { Category as CategoryType } from '@prezly/sdk';
import {
    BasePageProps,
    DEFAULT_PAGE_SIZE,
    getBasePageProps,
    processRequest,
} from '@prezly/theme-kit-nextjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils';
import { PaginationProps, StoryWithImage } from 'types';

const Category = dynamic(() => import('@/modules/Category'));

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    selectedCategory: CategoryType;
    pagination: PaginationProps;
}

const IndexPage: FunctionComponent<Props> = ({ selectedCategory, stories, pagination }) => (
    <Category category={selectedCategory!} stories={stories} pagination={pagination} />
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, basePageProps } = await getBasePageProps(context);

    const { slug } = context.params as { slug: string };
    const category = await api.getCategoryBySlug(slug);

    if (!category) {
        return {
            notFound: true,
        };
    }

    const { query } = context;
    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

    const { stories, storiesTotal } = await api.getStoriesFromCategory(category, {
        page,
        include: ['thumbnail_image'],
        localeCode: basePageProps.localeCode,
    });

    basePageProps.selectedCategory = category;
    basePageProps.translations = await importMessages(basePageProps.localeCode);

    return processRequest(context, basePageProps, `/category/${slug}`, {
        stories: stories as StoryWithImage[],
        pagination: {
            itemsTotal: storiesTotal,
            currentPage: page ?? 1,
            pageSize: DEFAULT_PAGE_SIZE,
        },
    });
};

export default IndexPage;
