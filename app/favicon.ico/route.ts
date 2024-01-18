import { Newsrooms } from '@prezly/theme-kit-nextjs/index';
import { notFound } from 'next/navigation';

import { app } from '@/adapters/server';

export async function GET() {
    const newsroom = await app().newsroom();

    const faviconUrl = Newsrooms.getFaviconUrl(newsroom, 180);

    if (!faviconUrl) notFound();

    return Response.redirect(faviconUrl);
}
