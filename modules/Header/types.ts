import type { Locale } from '@prezly/theme-kit-nextjs';

type Href = string;

export type LanguageVersions = {
    [localeCode in Locale.Code]?: Href;
};
