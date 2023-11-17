import { IntlMiddleware } from '@prezly/theme-kit-nextjs/server';

export function locale() {
    try {
        return IntlMiddleware.getLocaleFromHeader();
    } catch {
        return 'en';
    }
}
