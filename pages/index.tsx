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

const Stories = dynamic(() => import('@/modules/Stories'), { ssr: true });

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

const IndexPage: FunctionComponent<Props> = ({ stories, pagination }) => (
    <Stories stories={stories} pagination={pagination} />
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, basePageProps } = await getBasePageProps(context, { loadHomepageContacts: true });

    const { query } = context;
    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

    const storiesPaginated = await api.getStories({
        page,
        include: ['thumbnail_image'],
        localeCode: basePageProps.localeCode,
    });
    const { stories, storiesTotal } = storiesPaginated;

    basePageProps.translations = await importMessages(basePageProps.localeCode);

    return processRequest(context, basePageProps, '/', {
        // TODO: This is temporary until return types from API are figured out
        stories: stories as StoryWithImage[],
        pagination: {
            itemsTotal: storiesTotal,
            currentPage: page ?? 1,
            pageSize: DEFAULT_PAGE_SIZE,
        },
    });
};

export default IndexPage;
