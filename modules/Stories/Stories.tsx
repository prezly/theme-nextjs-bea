import { useCompanyInformation } from '@prezly/theme-kit-nextjs';
import { FunctionComponent } from 'react';

import { PaginationProps, StoryWithImage } from 'types';

import InfiniteStories from '../InfiniteStories';
import Layout from '../Layout';

interface Props {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

const Stories: FunctionComponent<Props> = ({ stories, pagination }) => {
    const companyInformation = useCompanyInformation();

    return (
        <Layout title={`${companyInformation.name} - Pressroom`}>
            <InfiniteStories initialStories={stories} pagination={pagination} />
        </Layout>
    );
};

export default Stories;
