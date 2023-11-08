/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Locale } from '@prezly/theme-kit-intl';
import { isNotUndefined } from '@technically/is-not-undefined';

import { api } from '@/theme-kit';
import type { LanguageVersions } from '@/theme-kit/language-versions';
import { RegisterLanguageVersions } from '@/theme-kit/language-versions';
import type { AppUrlGeneratorParams } from '@/theme-kit/routing';
import { routing } from '@/theme-kit/routing';

type Href = string;
type Language = { code: Locale.Code };

type Forbid<T> = { [key in keyof T]?: never };

type ExclusivePropsVariations<T> = {
    [variation in keyof T]: T[variation] & Forbid<Omit<T[keyof T], keyof T[variation]>>;
}[keyof T];

type Props = ExclusivePropsVariations<{
    routeName: AppUrlGeneratorParams & { languages?: Language[] };
    languagesMap: { languages: LanguageVersions };
    languagesList: { languages: Array<{ code: Locale.Code; href: Href | null | undefined }> };
}>;

export async function DeclareLanguages(props: Props) {
    // routeName variation
    if ('routeName' in props && props.routeName !== undefined) {
        const languages = props.languages ?? (await api().contentDelivery.languages());
        const { generateUrl } = await routing();
        const versions = generateLanguageVersions(languages, (localeCode) =>
            generateUrl(props.routeName, { ...props.params, localeCode }),
        );
        return <RegisterLanguageVersions versions={versions} />;
    }

    // languagesMap && languagesList variation
    if ('languages' in props && props.languages) {
        const versions = Array.isArray(props.languages)
            ? Object.fromEntries(
                  props.languages
                      .map(({ code, href }) => (href ? [code, href] : undefined))
                      .filter(isNotUndefined),
              )
            : props.languages;
        return <RegisterLanguageVersions versions={versions} />;
    }

    return null;
}

function generateLanguageVersions(
    languages: Language[],
    generateUrl: (code: Language['code']) => string | null | false | undefined,
): LanguageVersions {
    return Object.fromEntries(
        languages
            .map((lang) => {
                const href = generateUrl(lang.code);

                if (href) {
                    return [lang.code, href];
                }

                return undefined;
            })
            .filter(isNotUndefined),
    );
}
