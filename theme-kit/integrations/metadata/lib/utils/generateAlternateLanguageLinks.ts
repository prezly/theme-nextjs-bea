import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { getAlternateLanguageLinks } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

type Alternates = NonNullable<Metadata['alternates']>;
type GenerateUrlFn = (localeCode: Locale.Code) => string | undefined;

export function generateAlternateLanguageLinks(
    languages: Pick<NewsroomLanguageSettings, 'code' | 'is_default'>[],
    generateUrl: GenerateUrlFn,
): Alternates['languages'] {
    const links = getAlternateLanguageLinks(languages, (locale) => generateUrl(locale.code));

    return Object.fromEntries(links.map((link) => [link.hrefLang, link.href]));
}
