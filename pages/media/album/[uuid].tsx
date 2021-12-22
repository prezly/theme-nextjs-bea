import type { NewsroomGallery } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { importMessages } from '@/utils/lang';
import { getRedirectToCanonicalLocale } from '@/utils/locale';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, Translations } from 'types';

const Gallery = dynamic(() => import('@/modules/Gallery'), { ssr: true });

interface Props extends BasePageProps {
    gallery: NewsroomGallery;
    translations: Translations;
}

const GalleryPage: FunctionComponent<Props> = ({
    categories,
    companyInformation,
    gallery,
    languages,
    localeCode,
    newsroom,
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
        <Gallery gallery={gallery} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale } = context;

    const api = getPrezlyApi(request);
    const basePageProps = await api.getBasePageProps(request, locale);

    if (!basePageProps.localeResolved) {
        return { notFound: true };
    }

    const { uuid } = context.params as { uuid: string };

    const redirect = getRedirectToCanonicalLocale(basePageProps, locale, `/media/album/${uuid}`);
    if (redirect) {
        return { redirect };
    }

    const gallery = await api.getGallery(uuid);
    const translations = await importMessages(basePageProps.localeCode);

    return {
        props: {
            ...basePageProps,
            gallery,
            translations,
        },
    };
};

export default GalleryPage;
