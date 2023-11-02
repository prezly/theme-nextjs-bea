import { getNewsroomOgImageUrl } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { api } from '../api';

type Url = string;

interface Params {
    localeCode: Locale.Code;
    indexable?: boolean;
    imageUrl?: Url;
}

export async function generateRootMetadata({
    localeCode,
    indexable = true,
}: Params): Promise<Metadata> {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();
    const languageSettings = await contentDelivery.languageOrDefault(localeCode);
    const companyInformation = languageSettings.company_information;

    const siteName = companyInformation.name || newsroom.display_name;

    const pageTitle =
        companyInformation.seo_settings.meta_title ||
        companyInformation.seo_settings.default_meta_title ||
        companyInformation.name;

    const pageDescription =
        companyInformation.seo_settings.meta_description ||
        companyInformation.seo_settings.default_meta_description ||
        companyInformation.about_plaintext;

    const sharingImageUrl = getNewsroomOgImageUrl(newsroom, Locale.from(localeCode));

    return {
        title: {
            absolute: pageTitle,
            template: `%s | ${pageTitle}`,
            default: pageTitle,
        },
        description: pageDescription,
        robots: {
            index: indexable && newsroom.is_indexable,
            follow: indexable && newsroom.is_indexable,
        },
        alternates: {
            types: {
                'application/rss+xml': '/feed', // TODO: Check if it's fine using a relative URL
            },
        },
        openGraph: {
            siteName,
            title: pageTitle,
            description: pageDescription,
            locale: localeCode,
            images: [
                {
                    url: sharingImageUrl,
                    alt: pageTitle,
                },
            ],
        },
        twitter: {
            site: siteName,
            card: 'summary',
            images: [sharingImageUrl],
        },
        verification: {
            google: newsroom.google_search_console_key || undefined,
        },
    };
}
