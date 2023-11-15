import { IntlMiddleware } from '@prezly/theme-kit-nextjs/server';

export function locale() {
    return IntlMiddleware.getLocaleFromHeader();
}
