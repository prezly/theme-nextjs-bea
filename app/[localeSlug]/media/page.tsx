import { DEFAULT_GALLERY_PAGE_SIZE, translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generateMediaPageMetadata, handleLocaleSlug, intl, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Galleries } from '@/modules/Galleries';

interface Props {
    params: {
        localeSlug: string;
    };
}

async function resolve(params: Props['params']) {
    const { generateUrl } = await routing();
    const localeCode = await handleLocaleSlug(params.localeSlug, (locale) =>
        generateUrl('media', { localeCode: locale }),
    );
    return { localeCode };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { localeCode } = await resolve(params);
    const { formatMessage } = await intl(localeCode);

    return generateMediaPageMetadata({
        locale: localeCode,
        title: formatMessage(translations.mediaGallery.title),
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
