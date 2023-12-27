import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';

import { app } from './app';

type LocaleSlug = Parameters<(typeof IntlMiddleware)['handleLocaleSlug']>[0];

export function handleLocaleSlug(
    localeSlug: LocaleSlug,
    generateUrl: IntlMiddleware.LocaleMatchContext['generateUrl'],
) {
    return IntlMiddleware.handleLocaleSlug(localeSlug, async () => ({
        languages: await app().languages(),
        generateUrl,
    }));
}

export function matchLocaleSlug(localeSlug: LocaleSlug) {
    return IntlMiddleware.matchLocaleSlug(localeSlug, {
        languages: app().languages,
    });
}

export function getLocaleSlugFromHeader() {
    return IntlMiddleware.getLocaleSlugFromHeader();
}
