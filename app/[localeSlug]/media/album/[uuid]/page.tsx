import type { NewsroomGallery } from '@prezly/sdk';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
    app,
    generateMediaGalleryPageMetadata,
    handleLocaleSlug,
    routing,
} from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Gallery } from '@/modules/Gallery';

interface Props {
    params: {
        localeSlug: string;
        uuid: NewsroomGallery['uuid'];
    };
}

async function resolve({ localeSlug, uuid }: Props['params']) {
    const { generateUrl } = await routing();

    const localeCode = await handleLocaleSlug(localeSlug, (locale) =>
        generateUrl('mediaGallery', {
            localeCode: locale,
            uuid,
        }),
    );

    const gallery = (await app().gallery(uuid)) ?? notFound();

    return { localeCode, gallery };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gallery, localeCode } = await resolve(params);
    return generateMediaGalleryPageMetadata({ locale: localeCode, gallery });
}

export default async function AlbumPage({ params }: Props) {
    const { localeCode, gallery } = await resolve(params);
    const { generateUrl } = await routing();

    return (
        <>
            <BroadcastTranslations routeName="mediaGallery" params={{ uuid: gallery.uuid }} />
            <Gallery
                localeCode={localeCode}
                gallery={gallery}
                href={generateUrl('mediaGallery', { uuid: gallery.uuid })}
            />
        </>
    );
}
