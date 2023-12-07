import { type PaginationProps, useCurrentCategory } from '@prezly/theme-kit-nextjs';
import { getCategoryPageServerSideProps } from '@prezly/theme-kit-nextjs/server';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages, isTrackingEnabled } from '@/utils';
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

export const getServerSideProps = getCategoryPageServerSideProps<BasePageProps, 'thumbnail_image'>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
    }),
    { extraStoryFields: ['thumbnail_image'] },
);

export default CategoryPage;
