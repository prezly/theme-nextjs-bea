import { DEFAULT_GALLERY_PAGE_SIZE } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { Galleries } from '@/modules/Galleries';
import { api } from '@/theme-kit';
import { generateMediaMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return generateMediaMetadata(params);
}

export default async function MediaPage() {
    const { galleries, pagination } = await api().contentDelivery.galleries({
        limit: DEFAULT_GALLERY_PAGE_SIZE,
    });

    return (
        <>
            <DeclareLanguages routeName="media" />
            <Galleries
                initialGalleries={galleries}
                pageSize={DEFAULT_GALLERY_PAGE_SIZE}
                total={pagination.total_records_number}
            />
        </>
    );
}
