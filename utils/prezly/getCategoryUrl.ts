import { Category } from '@prezly/sdk/dist/types';

export default function getCategoryUrl(category: Category) {
    // Use first available locale with a slug
    // Change this for multilang support
    const { i18n } = category;
    const locales = Object.keys(i18n);
    const locale = locales.find((localeCode) => !!i18n[localeCode].slug) || locales[0];

    return `/category/${i18n[locale].slug}`;
}
