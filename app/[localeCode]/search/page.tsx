import { type Locale, translations } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { routing } from '@/theme-kit';
import { intl } from '@/theme-kit/intl/server';
import { generateAlternateLanguageLinks } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { generateUrl } = await routing();
    const { formatMessage } = await intl(params.localeCode);

    return {
        title: formatMessage(translations.search.title),
        alternates: {
            languages: await generateAlternateLanguageLinks((locale) =>
                generateUrl('search', { localeCode: locale.code }),
            ),
        },
    };
}

export default async function SearchPage({ params }: Props) {
    return (
        <>
            <DeclareLanguages routeName="search" />
            <div>Search results page in {params.localeCode}</div>
        </>
    );
}
