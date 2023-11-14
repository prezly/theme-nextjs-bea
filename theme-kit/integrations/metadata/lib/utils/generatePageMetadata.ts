/* eslint-disable @typescript-eslint/no-use-before-define */
import { getNewsroomOgImageUrl } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { generateAlternateLanguageLinks } from '@/theme/server/metadata';
import { multiResolveAsync } from '@/theme-kit/resolvable';

import type { PageUrlGenerator, Prerequisites } from '../types';

import { mergePageMetadata } from './mergePageMetadata';

interface Params extends Prerequisites {
    title?: Metadata['title'];
    description?: Metadata['description'];
    imageUrl?: string;
    generateUrl?: PageUrlGenerator;
}

export async function generatePageMetadata(
    { title, description, imageUrl, generateUrl, ...resolvable }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const [locale, newsroom, companyInformation, languages] = await multiResolveAsync([
        resolvable.locale,
        resolvable.newsroom,
        resolvable.companyInformation,
        resolvable.languages,
    ]);

    const siteName = companyInformation.name || newsroom.display_name;
    const titleString = extractPlaintextTitle(title);
    const ogImageUrl = imageUrl ?? getNewsroomOgImageUrl(newsroom, Locale.from(locale));

    return mergePageMetadata(
        {
            title,
            description,
            alternates: {
                canonical: generateUrl?.(locale),
                types: {
                    'application/rss+xml': '/feed', // TODO: Check if it's fine using a relative URL
                },
                languages: generateUrl
                    ? generateAlternateLanguageLinks(languages, generateUrl)
                    : undefined,
            },
            openGraph: {
                siteName,
                title: titleString,
                description: description ?? undefined,
                locale,
                images: [{ url: ogImageUrl, alt: titleString }],
            },
            twitter: {
                site: siteName,
                card: 'summary',
                images: [ogImageUrl],
            },
        },
        ...metadata,
    );
}

export namespace generatePageMetadata {
    export type Parameters = Params;
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
