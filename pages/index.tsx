import {
    DEFAULT_PAGE_SIZE,
    getNewsroomServerSideProps,
    processRequest,
} from '@prezly/theme-kit-nextjs';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages, isTrackingEnabled } from '@/utils';
import type { BasePageProps, PaginationProps, StoryWithImage } from 'types';

const Stories = dynamic(() => import('@/modules/Stories'), { ssr: true });

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

const IndexPage: FunctionComponent<Props> = ({ stories, pagination }) => (
    <Stories stories={stories} pagination={pagination} />
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, serverSideProps } = await getNewsroomServerSideProps(context, {
        loadHomepageContacts: true,
    });

    const { query } = context;
    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

    const { localeCode } = serverSideProps.newsroomContextProps;

    const storiesPaginated = await api.getStories({
        page,
        include: ['thumbnail_image'],
        localeCode,
    });
    const { stories, storiesTotal } = storiesPaginated;

    return processRequest(
        context,
        {
            ...serverSideProps,
            // TODO: This is temporary until return types from API are figured out
            stories: stories as StoryWithImage[],
            pagination: {
                itemsTotal: storiesTotal,
                currentPage: page ?? 1,
                pageSize: DEFAULT_PAGE_SIZE,
            },
            isTrackingEnabled: isTrackingEnabled(context),
            translations: await importMessages(localeCode),
        },
        '/',
    );
};

export default IndexPage;
