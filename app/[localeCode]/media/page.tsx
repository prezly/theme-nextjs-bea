import type { Locale } from '@prezly/theme-kit-nextjs';
import { DEFAULT_GALLERY_PAGE_SIZE, translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { app, generateMediaPageMetadata, intl, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Galleries } from '@/modules/Galleries';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { formatMessage } = await intl(params.localeCode);

    return generateMediaPageMetadata({
        locale: params.localeCode,
        title: formatMessage(translations.mediaGallery.title),
    });
}

export default async function MediaPage(props: Props) {
    const { localeCode } = await props.params;
    const { galleries, pagination } = await app().galleries({
        limit: DEFAULT_GALLERY_PAGE_SIZE,
    });
    const newsroom = await app().newsroom();

    // Redirect to the gallery immediately if it's the only one
    if (galleries.length === 1) {
        const galleryRoute = (await routing()).generateUrl('mediaGallery', {
            localeCode,
            uuid: galleries[0].uuid,
        });

        redirect(galleryRoute);
    }

    return (
        <>
            <BroadcastTranslations routeName="media" />
            <Galleries
                initialGalleries={galleries}
                localeCode={localeCode}
                pageSize={DEFAULT_GALLERY_PAGE_SIZE}
                total={pagination.total_records_number}
                newsroomUuid={newsroom.uuid}
            />
        </>
    );
}
