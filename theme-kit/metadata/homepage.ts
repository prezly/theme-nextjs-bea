import type { Locale } from '@prezly/theme-kit-intl';

import { routing } from '../routing';

import { generateAlternateLanguageLinks, generateMetadata } from './utils';

interface Params {
    localeCode: Locale.Code;
}

export async function generateHomepageMetadata({ localeCode }: Params) {
    const { generateUrl } = await routing();

    const languages = await generateAlternateLanguageLinks((locale) =>
        generateUrl('index', { localeCode: locale.code }),
    );

    return generateMetadata({
        localeCode,
        alternates: {
            languages,
        },
    });
}
