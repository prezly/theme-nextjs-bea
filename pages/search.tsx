import { getNewsroomServerSideProps, processRequest } from '@prezly/theme-kit-nextjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils/lang';
import { AnyPageProps } from 'types';

const SearchPage = dynamic(() => import('@/modules/Search'), { ssr: true });

const SearchResultsPage: FunctionComponent<AnyPageProps> = () => <SearchPage />;

export const getServerSideProps: GetServerSideProps<AnyPageProps> = async (context) => {
    const { serverSideProps } = await getNewsroomServerSideProps(context);

    return processRequest(
        context,
        {
            ...serverSideProps,
            translations: await importMessages(serverSideProps.newsroomContextProps.localeCode),
        },
        '/search',
    );
};

export default SearchResultsPage;
