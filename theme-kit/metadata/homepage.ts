import type { Locale } from '@prezly/theme-kit-intl';

import { api } from '@/theme-kit';

import { routing } from '../routing';

import { generateAlternateLanguageLinks, generateMetadata } from './utils';

interface Params {
    localeCode: Locale.Code;
}

export async function generateHomepageMetadata({ localeCode }: Params) {
    const { contentDelivery } = api();
    const { generateUrl } = await routing();

    const languages = await contentDelivery.languages();

    const link = await generateAlternateLanguageLinks((locale) => {
        const language = languages.find((lang) => lang.code === locale.code);

        return language?.public_stories_count
            ? generateUrl('index', { localeCode: locale.code })
            : undefined;
    });

    return generateMetadata({
        localeCode,
        alternates: {
            languages: link,
        },
    });
}
