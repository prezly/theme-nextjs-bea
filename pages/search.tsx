import { getNewsroomServerSideProps, processRequest } from '@prezly/theme-kit-nextjs';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils/lang';
import type { BasePageProps } from 'types';

import { isTrackingEnabled } from '../utils';

const SearchPage = dynamic(() => import('@/modules/Search'), { ssr: true });

const SearchResultsPage: FunctionComponent<BasePageProps> = () => <SearchPage />;

export const getServerSideProps: GetServerSideProps<BasePageProps> = async (context) => {
    const { serverSideProps } = await getNewsroomServerSideProps(context);

    return processRequest(
        context,
        {
            ...serverSideProps,
            isTrackingEnabled: isTrackingEnabled(context),
            translations: await importMessages(serverSideProps.newsroomContextProps.localeCode),
        },
        '/search',
    );
};

export default SearchResultsPage;
