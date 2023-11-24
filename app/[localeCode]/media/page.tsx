import { DEFAULT_GALLERY_PAGE_SIZE, type Locale, translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generatePageMetadata, intl, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Galleries } from '@/modules/Galleries';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata(_: Props): Promise<Metadata> {
    const { formatMessage } = await intl();
    const { generateUrl } = await routing();

    return generatePageMetadata({
        title: formatMessage(translations.mediaGallery.title),
        generateUrl: (localeCode) => generateUrl('media', { localeCode }),
    });
}

export default async function MediaPage() {
    const { galleries, pagination } = await app().galleries({
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
