import { type Locale, translations } from '@prezly/theme-kit-nextjs';
import { DEFAULT_GALLERY_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { Galleries } from '@/modules/Galleries';
import { Header } from '@/modules/Header';
import { Content } from '@/modules/Layout';
import { api, generatePageMetadata, intl, routing } from '@/theme/server';

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
    const { galleries, pagination } = await api().contentDelivery.galleries({
        limit: DEFAULT_GALLERY_PAGE_SIZE,
    });

    return (
        <>
            <Header routeName="media" />
            <Content>
                <Galleries
                    initialGalleries={galleries}
                    pageSize={DEFAULT_GALLERY_PAGE_SIZE}
                    total={pagination.total_records_number}
                />
            </Content>
        </>
    );
}
