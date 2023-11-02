import type { Locale } from '@prezly/theme-kit-intl';
import { translations } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { intl } from '@/theme-kit/intl/server';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { formatMessage } = await intl(params.localeCode);

    return {
        title: formatMessage(translations.mediaGallery.title),
    };
}

export default async function MediaPage({ params }: Props) {
    return <div>Media gallery in {params.localeCode}</div>;
}
