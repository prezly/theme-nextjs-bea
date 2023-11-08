/* eslint-disable @typescript-eslint/no-use-before-define */
import { getAlternateLanguageLinks } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { api } from '@/theme-kit';

type Alternates = Exclude<Metadata['alternates'], undefined | null>;
type Languages = Exclude<Alternates['languages'], undefined>;
type GenerateUrlFn = (locale: Locale) => string | undefined;

export async function generateAlternateLanguageLinks(
    generateUrl: GenerateUrlFn,
): Promise<Languages> {
    const { contentDelivery } = api();
    const languages = await contentDelivery.languages();

    const links = getAlternateLanguageLinks(languages, generateUrl);

    return Object.fromEntries(links.map((link) => [link.hrefLang, link.href]));
}
