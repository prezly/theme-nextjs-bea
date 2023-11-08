/* eslint-disable @typescript-eslint/no-use-before-define */
import { getNewsroomOgImageUrl } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { api } from '@/theme-kit';

import { mergeMetadata } from './mergeMetadata';

interface Params extends Metadata {
    localeCode: Locale.Code;
    imageUrl?: string;
}

export async function generateMetadata({
    localeCode,
    imageUrl,
    title,
    description,
    ...metadata
}: Params): Promise<Metadata> {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();
    const languageSettings = await contentDelivery.languageOrDefault(localeCode);
    const companyInformation = languageSettings.company_information;

    const siteName = companyInformation.name || newsroom.display_name;

    const titleString = extractPlaintextTitle(title);

    const ogImageUrl = imageUrl ?? getNewsroomOgImageUrl(newsroom, Locale.from(localeCode));

    return mergeMetadata(
        {
            title,
            description,
            alternates: {
                types: {
                    'application/rss+xml': '/feed', // TODO: Check if it's fine using a relative URL
                },
            },
            openGraph: {
                siteName,
                title: titleString,
                description: description ?? undefined,
                locale: localeCode,
                images: [
                    {
                        url: ogImageUrl,
                        alt: titleString,
                    },
                ],
            },
            twitter: {
                site: siteName,
                card: 'summary',
                images: [ogImageUrl],
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
