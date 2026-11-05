import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { galleryPreview } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Gallery } from '@/modules/Gallery';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ localeCode: Locale.Code; uuid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { uuid } = await params;
    const gallery = (await galleryPreview(uuid)) ?? notFound();
    return {
        title: gallery.name,
        robots: { index: false, follow: false },
        alternates: null,
        openGraph: null,
        twitter: null,
        referrer: 'strict-origin-when-cross-origin',
    };
}

export default async function GalleryPreviewPage({ params }: Props) {
    const { uuid, localeCode } = await params;
    const gallery = (await galleryPreview(uuid)) ?? notFound();

    return (
        <>
            <BroadcastTranslations routeName="index" params={{}} />
            <Gallery localeCode={localeCode} gallery={gallery} href="" socialNetworks={[]} />
        </>
    );
}
