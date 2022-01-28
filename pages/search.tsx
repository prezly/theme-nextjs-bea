import { BasePageProps, getBasePageProps, processRequest } from '@prezly/theme-kit-nextjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils/lang';

const SearchPage = dynamic(() => import('@/modules/Search'), { ssr: true });

const SearchResultsPage: FunctionComponent<BasePageProps> = () => <SearchPage />;

export const getServerSideProps: GetServerSideProps<BasePageProps> = async (context) => {
    const { basePageProps } = await getBasePageProps(context);

    basePageProps.translations = await importMessages(basePageProps.localeCode);

    return processRequest(context, basePageProps, '/search');
};

export default SearchResultsPage;
