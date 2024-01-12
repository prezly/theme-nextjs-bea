import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateMediaGalleryPageMetadata, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Gallery } from '@/modules/Gallery';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: NewsroomGallery['uuid'];
    };
}

async function resolve({ uuid }: Props['params']) {
    const gallery = (await app().gallery(uuid)) ?? notFound();

    return { gallery };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gallery } = await resolve(params);
    return generateMediaGalleryPageMetadata({ locale: params.localeCode, gallery });
}

export default async function AlbumPage({ params }: Props) {
    const { gallery } = await resolve(params);
    const { generateUrl } = await routing();

    return (
        <>
            <BroadcastTranslations routeName="mediaGallery" params={{ uuid: gallery.uuid }} />
            <Gallery
                localeCode={params.localeCode}
                gallery={gallery}
                href={generateUrl('mediaGallery', { uuid: gallery.uuid })}
            />
        </>
    );
}
