import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';

export function locale() {
    return IntlMiddleware.getLocaleFromHeader();
}
