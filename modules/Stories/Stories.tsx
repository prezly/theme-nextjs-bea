import { useCompanyInformation } from '@prezly/theme-kit-nextjs';

import type { PaginationProps, StoryWithImage } from 'types';

import InfiniteStories from '../InfiniteStories';
import Layout from '../Layout';

interface Props {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

function Stories({ stories, pagination }: Props) {
    const companyInformation = useCompanyInformation();

    return (
        <Layout title={`${companyInformation.name} - Pressroom`}>
            <InfiniteStories initialStories={stories} pagination={pagination} />
        </Layout>
    );
}

export default Stories;
