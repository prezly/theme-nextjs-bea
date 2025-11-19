import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateMediaGalleryPageMetadata, routing } from '@/adapters/server';
import { BroadcastGallery, BroadcastTranslations } from '@/modules/Broadcast';
import { Gallery } from '@/modules/Gallery';
import { parsePreviewSearchParams } from '@/utils';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        uuid: NewsroomGallery['uuid'];
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { uuid } = await params;
    const gallery = (await app().gallery(uuid)) ?? notFound();

    return { gallery };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { gallery } = await resolve(props.params);
    return generateMediaGalleryPageMetadata({ locale: params.localeCode, gallery });
}

export default async function AlbumPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const { gallery } = await resolve(props.params);
    const { generateAbsoluteUrl } = await routing();
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            <BroadcastGallery gallery={gallery} />
            <BroadcastTranslations routeName="mediaGallery" params={{ uuid: gallery.uuid }} />
            <Gallery
                localeCode={params.localeCode}
                gallery={gallery}
                href={generateAbsoluteUrl('mediaGallery', { uuid: gallery.uuid })}
                socialNetworks={themeSettings.sharing_actions}
            />
        </>
    );
}
