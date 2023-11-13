import { app, configureAppRouter } from '@/theme/server';
import { createIntlMiddleware } from '@/theme-kit/middleware';

export const middleware = createIntlMiddleware(configureAppRouter, {
    defaultLocale: () => app().defaultLocale(),
    locales: () => app().locales(),
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml).*)',
    ],
};
