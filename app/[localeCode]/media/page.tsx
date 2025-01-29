import type { Locale } from '@prezly/theme-kit-nextjs';
import { DEFAULT_GALLERY_PAGE_SIZE, translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generateMediaPageMetadata, intl } from '@/adapters/server';
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
    const params = await props.params;
    const { galleries, pagination } = await app().galleries({
        limit: DEFAULT_GALLERY_PAGE_SIZE,
    });

    return (
        <>
            <BroadcastTranslations routeName="media" />
            <Galleries
                initialGalleries={galleries}
                localeCode={params.localeCode}
                pageSize={DEFAULT_GALLERY_PAGE_SIZE}
                total={pagination.total_records_number}
            />
        </>
    );
}
