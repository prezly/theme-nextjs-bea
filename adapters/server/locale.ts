import { NextIntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';

export function getLocaleFromHeaderOptingInForDynamicRenderingWithoutCache() {
    return NextIntlMiddleware.getLocaleFromHeader();
}
