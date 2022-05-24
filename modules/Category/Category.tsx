import type { Category as CategoryType } from '@prezly/sdk';
import type { PaginationProps } from '@prezly/theme-kit-nextjs';

import type { StoryWithImage } from 'types';

import InfiniteStories from '../InfiniteStories';
import Layout from '../Layout';

import CategoryHeader from './CategoryHeader';

interface Props {
    category: CategoryType;
    pagination: PaginationProps;
    stories: StoryWithImage[];
}

function Category({ category, pagination, stories }: Props) {
    return (
        <Layout
            title={category.display_name}
            description={category.display_description || undefined}
        >
            <CategoryHeader category={category} />

            <InfiniteStories initialStories={stories} pagination={pagination} category={category} />
        </Layout>
    );
}

export default Category;
