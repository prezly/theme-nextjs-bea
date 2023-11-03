import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { api } from '../api';

import { generateMetadata } from './utils';

interface Params {
    localeCode: Locale.Code;
    indexable?: boolean;
}

export async function generateRootMetadata({
    localeCode,
    indexable = true,
}: Params): Promise<Metadata> {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();

    const languageSettings = await contentDelivery.languageOrDefault(localeCode);
    const companyInformation = languageSettings.company_information;

    const title =
        companyInformation.seo_settings.meta_title ||
        companyInformation.seo_settings.default_meta_title ||
        companyInformation.name;

    const description =
        companyInformation.seo_settings.meta_description ||
        companyInformation.seo_settings.default_meta_description ||
        companyInformation.about_plaintext;

    return generateMetadata({
        localeCode,
        title: {
            template: `%s | ${title}`,
            default: title,
        },
        description,
        robots: {
            index: indexable && newsroom.is_indexable,
            follow: indexable && newsroom.is_indexable,
        },
        verification: {
            google: newsroom.google_search_console_key || undefined,
        },
    });
}
