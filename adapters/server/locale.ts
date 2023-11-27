import { IntlMiddleware } from '@prezly/theme-kit-nextjs/server';

export function getLocaleFromHeaderOptingInForDynamicRenderingWithoutCache() {
    return IntlMiddleware.getLocaleFromHeader();
}
