import { FunctionComponent } from 'react';

import { PaginationProps, StoryWithImage } from 'types';

import InfiniteStories from '../InfiniteStories';
import Layout from '../Layout';

interface Props {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

const Stories: FunctionComponent<Props> = ({ stories, pagination }) => (
    <Layout>
        <InfiniteStories initialStories={stories} pagination={pagination} />
    </Layout>
);

export default Stories;
