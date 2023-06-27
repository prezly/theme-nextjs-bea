import { type PaginationProps } from '@prezly/theme-kit-nextjs';

import type { StoryWithImage } from 'types';

import InfiniteStories from '../InfiniteStories';
import Layout from '../Layout';

interface Props {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

function Stories({ stories, pagination }: Props) {
    return (
        <Layout>
            <InfiniteStories initialStories={stories} pagination={pagination} />
        </Layout>
    );
}

export default Stories;
