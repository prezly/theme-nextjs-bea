import type { Locale } from '@prezly/theme-kit-nextjs';
import { isNotUndefined } from '@technically/is-not-undefined';

import { api, app, type AppUrlGeneratorParams, environment, routing } from '@/adapters/server';

import { Categories } from './Categories';
import { Languages } from './Languages';
import type { LanguageVersions } from './types';
import * as ui from './ui';

type Href = string;
type Forbid<T> = { [key in keyof T]?: never };
type ExclusivePropsVariations<T> = {
    [variation in keyof T]: T[variation] & Forbid<Omit<T[keyof T], keyof T[variation]>>;
}[keyof T];

type Props = ExclusivePropsVariations<{
    routeName: AppUrlGeneratorParams;
    languagesMap: { languages: LanguageVersions };
    languagesList: { languages: Array<{ code: Locale.Code; href: Href | null | undefined }> };
}> & {
    isSearchPage?: boolean;
};

export async function Header(props: Props) {
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = environment();
    const localeCode = app().locale();
    const newsroom = await app().newsroom();
    const language = await app().languageOrDefault(localeCode);

    const categories = await app().translatedCategories();

    const algoliaSettings =
        ALGOLIA_APP_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX
            ? {
                  appId: ALGOLIA_APP_ID,
                  apiKey: ALGOLIA_API_KEY,
                  index: ALGOLIA_INDEX,
              }
            : undefined;

    const languageVersions = await generateLanguageVersionsMap(props);

    return (
        <ui.Header
            algoliaSettings={algoliaSettings}
            localeCode={localeCode}
            newsroom={newsroom}
            information={language.company_information}
            categories={categories}
            isSearchPage={props.isSearchPage}
        >
            <Categories />
            <Languages languageVersions={languageVersions ?? {}} />
        </ui.Header>
    );
}

async function generateLanguageVersionsMap(props: Props) {
    const { generateUrl } = await routing();

    const languages = await api().contentDelivery.languages();

    // routeName variation
    if ('routeName' in props && props.routeName !== undefined) {
        const generateHref = (localeCode: Locale.Code) =>
            generateUrl(props.routeName, { ...props.params, localeCode });

        return Object.fromEntries(languages.map((lang) => [lang.code, generateHref(lang.code)]));
    }

    const homepages = Object.fromEntries(
        languages.map((lang) => [lang.code, generateUrl('index', { localeCode: lang.code })]),
    );

    // languagesMap && languagesList variation
    if ('languages' in props && props.languages && Array.isArray(props.languages)) {
        const translated = Object.fromEntries(
            props.languages
                .map(({ code, href }) => (href ? [code, href] : undefined))
                .filter(isNotUndefined),
        );

        return {
            ...homepages,
            ...translated,
        };
    }

    if ('languages' in props && props.languages && !Array.isArray(props.languages)) {
        return {
            ...homepages,
            ...props.languages,
        };
    }

    return undefined;
}
