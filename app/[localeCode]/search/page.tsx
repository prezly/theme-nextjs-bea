import { type Locale, translations } from '@prezly/theme-kit-intl';
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
        title: formatMessage(translations.search.title),
    };
}

export default async function SearchPage({ params }: Props) {
    return <div>Search results page in {params.localeCode}</div>;
}
