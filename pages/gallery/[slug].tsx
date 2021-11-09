import { NewsroomGallery } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { PageSeo } from '@/components/seo';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { getAssetsUrl, getPrezlyApi } from '@/utils/prezly';
import { BasePageProps } from 'types';

const Gallery = dynamic(() => import('@/modules/Gallery'), { ssr: true });
const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });

interface Props extends BasePageProps {
    gallery: NewsroomGallery;
}

const GalleryPage: FunctionComponent<Props> = ({
    categories,
    companyInformation,
    gallery,
    languages,
    locale,
    newsroom,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        locale={locale}
    >
        <PageSeo
            title={gallery.title}
            description=""
            url={`${newsroom.url}gallery/${gallery.uuid}`}
            imageUrl={getAssetsUrl(gallery.images[0].uploadcare_image.uuid)}
        />
        <Layout>
            <Gallery gallery={gallery} />
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const basePageProps = await api.getBasePageProps(context.locale);
    const { slug } = context.params as { slug: string };
    const gallery = await api.getGallery(slug);

    return {
        props: {
            ...basePageProps,
            gallery,
        },
    };
};

export default GalleryPage;
