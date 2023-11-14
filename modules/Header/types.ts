import type { Locale } from '@prezly/theme-kit-intl';

type Href = string;

export type LanguageVersions = {
    [localeCode in Locale.Code]?: Href;
};
