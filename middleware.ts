import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';

import { configureAppRouter } from '@/adapters/server';

export const middleware = IntlMiddleware.create(configureAppRouter);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!robots.txt|api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml).*)',
    ],
};
