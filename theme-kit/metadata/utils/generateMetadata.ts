/* eslint-disable @typescript-eslint/no-use-before-define */
import { getNewsroomOgImageUrl } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl/build/cjs';
import type { Metadata } from 'next';

import { api } from '../../api';

import { mergeMetadata } from './mergeMetadata';

interface Params extends Metadata {
    localeCode: Locale.Code;
}

export async function generateMetadata({
    localeCode,
    title,
    description,
    ...metadata
}: Params): Promise<Metadata> {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();
    const languageSettings = await contentDelivery.languageOrDefault(localeCode);
    const companyInformation = languageSettings.company_information;

    const siteName = companyInformation.name || newsroom.display_name;

    const pageTitle =
        extractPlaintextTitle(title) ||
        companyInformation.seo_settings.meta_title ||
        companyInformation.seo_settings.default_meta_title ||
        companyInformation.name;

    const pageDescription =
        description ||
        companyInformation.seo_settings.meta_description ||
        companyInformation.seo_settings.default_meta_description ||
        companyInformation.about_plaintext;

    const sharingImageUrl = getNewsroomOgImageUrl(newsroom, Locale.from(localeCode));

    const titleTemplate =
        typeof title === 'object' && title !== null
            ? title
            : {
                  absolute: pageTitle,
                  template: `%s | ${pageTitle}`,
                  default: pageTitle,
              };

    return mergeMetadata(
        {
            title: titleTemplate,
            description: pageDescription,
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
        },
        metadata,
    );
}

function extractPlaintextTitle(title: Metadata['title']): string | undefined {
    if (title === undefined || title === null) {
        return undefined;
    }

    if (typeof title === 'string') {
        return title;
    }

    if ('absolute' in title && title.absolute) {
        return title.absolute;
    }

    if ('default' in title && title.default) {
        return title.default;
    }

    return undefined;
}
