import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { importMessages } from '@/utils/lang';
import { getRedirectToCanonicalLocale } from '@/utils/locale';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, Translations } from 'types';

const SearchPage = dynamic(() => import('@/modules/Search'), { ssr: true });

interface Props extends BasePageProps {
    translations: Translations;
}

const SearchResultsPage: FunctionComponent<Props> = ({
    categories,
    newsroom,
    companyInformation,
    languages,
    localeCode,
    translations,
    themePreset,
    algoliaSettings,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        translations={translations}
        themePreset={themePreset}
        algoliaSettings={algoliaSettings}
    >
        <SearchPage />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale, query } = context;
    const api = getPrezlyApi(request);

    const basePageProps = await api.getBasePageProps(request, locale);
    const { localeResolved } = basePageProps;

    if (!localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(basePageProps, locale, '/search', query);
    if (redirect) {
        return { redirect };
    }

    const translations = await importMessages(basePageProps.localeCode);

    return {
        props: {
            ...basePageProps,
            translations,
        },
    };
};

export default SearchResultsPage;
