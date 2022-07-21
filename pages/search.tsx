import { getSearchPageStaticProps } from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils/lang';
import type { BasePageProps } from 'types';

import { isTrackingEnabled } from '../utils';

const SearchPage = dynamic(() => import('@/modules/Search'), { ssr: true });

const SearchResultsPage: FunctionComponent<BasePageProps> = () => <SearchPage />;

export const getStaticProps = getSearchPageStaticProps(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
    }),
);

export default SearchResultsPage;
