/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { getAlternateLanguageLinks } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
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

    const links = getAlternateLanguageLinksWithTitles(languages, generateUrl);

    return Object.fromEntries(
        links.map((link) => [link.hrefLang, [{ url: link.href, title: link.title }]]),
    );
}

function getAlternateLanguageLinksWithTitles<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'locale'>,
>(languages: Language[], generateUrl: (locale: Locale) => string | undefined) {
    const links = getAlternateLanguageLinks(languages, generateUrl);

    return links.map(({ href, hrefLang }) => {
        const language = languages.find((lang) => Locale.from(lang.code).isoCode === hrefLang);
        if (language) {
            return { href, hrefLang, title: language.locale.native_name };
        }
        return { href, hrefLang };
    });
}
