import { DEFAULT_GALLERY_PAGE_SIZE, type Locale, translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generateMediaPageMetadata, intl } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Galleries } from '@/modules/Galleries';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata(_: Props): Promise<Metadata> {
    const { formatMessage } = await intl();

    return generateMediaPageMetadata({
        title: formatMessage(translations.mediaGallery.title),
    });
}

export default async function MediaPage() {
    const { galleries, pagination } = await app().mediaAlbums({
        limit: DEFAULT_GALLERY_PAGE_SIZE,
    });

    return (
        <>
            <BroadcastTranslations routeName="media" />
            <Galleries
                initialGalleries={galleries}
                pageSize={DEFAULT_GALLERY_PAGE_SIZE}
                total={pagination.total_records_number}
            />
        </>
    );
}
