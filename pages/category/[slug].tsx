import {
    getCategoryPageStaticPaths,
    getCategoryPageStaticProps,
    type PaginationProps,
    useCurrentCategory,
} from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages, isTrackingEnabled, loadFeaturedStories } from '@/utils';
import type { BasePageProps, StoryWithImage } from 'types';

const Category = dynamic(() => import('@/modules/Category'));

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

const CategoryPage: FunctionComponent<Props> = ({ stories, pagination }) => {
    const currentCategory = useCurrentCategory();

    return <Category category={currentCategory!} stories={stories} pagination={pagination} />;
};

export const getStaticProps = getCategoryPageStaticProps<BasePageProps, StoryWithImage>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
        featuredStories: await loadFeaturedStories(context),
    }),
    { extraStoryFields: ['thumbnail_image'] },
);

export const getStaticPaths = getCategoryPageStaticPaths;

export default CategoryPage;
