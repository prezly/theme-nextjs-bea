import type { Locale } from '@prezly/theme-kit-intl';
import { translations } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { routing } from '@/theme-kit';
import { intl } from '@/theme-kit/intl/server';

import { generateAlternateLanguageLinks, generateMetadata } from './utils';

interface Params extends Metadata {
    localeCode: Locale.Code;
}
export async function generateMediaMetadata({ localeCode }: Params): Promise<Metadata> {
    const { generateUrl } = await routing();
    const { formatMessage } = await intl(localeCode);

    const languages = await generateAlternateLanguageLinks((locale) =>
        generateUrl('media', {
            localeCode: locale.code,
        }),
    );

    return generateMetadata({
        localeCode,
        title: formatMessage(translations.mediaGallery.title),
        alternates: {
            canonical: generateUrl('media', { localeCode }),
            languages,
        },
    });
}
