import { IntlMiddleware } from '@prezly/theme-kit-nextjs/server';
import type { NextRequest } from 'next/server';

import { app, configureAppRouter } from '@/adapters/server';

const parent = IntlMiddleware.create(configureAppRouter, {
    defaultLocale: () => app().defaultLocale(),
    locales: () => app().locales(),
});

export const middleware = (req: NextRequest) => {
    console.log(`Preloading data for ${req.url}`);

    app().preload();

    return parent(req);
};

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
