import { setupMiddleware } from '@/theme-kit';

export const middleware = setupMiddleware();

export const config = {
    // Skip all paths that should not be internationalized. This example skips
    // certain folders and all pathnames with a dot (e.g. favicon.ico)
    // matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
