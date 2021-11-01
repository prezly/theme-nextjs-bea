import { Category } from '@prezly/sdk/dist/types';

export default function getCategoryUrl(category: Category, locale: string) {
    const { i18n } = category;
    const localesWithSlugs = Object.keys(i18n).filter((localeCode) =>
        Boolean(i18n[localeCode].slug),
    );
    const localizedSlug =
        localesWithSlugs.find((localeCode) => localeCode === locale) || localesWithSlugs[0];

    return `/category/${localizedSlug}`;
}
