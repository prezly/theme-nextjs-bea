import { Sitemap } from '@prezly/theme-kit-nextjs';
import type { NextRequest } from 'next/server';

import { buildSitemapIndexXml, buildSitemapPage } from '../sitemap-utils';

export const dynamic = 'force-dynamic';

const CACHE_CONTROL = 'public, max-age=0, s-maxage=900, stale-while-revalidate=86400';

export async function GET(request: NextRequest) {
    const pageParam = request.nextUrl.searchParams.get('page');

    if (pageParam === null) {
        return xmlResponse(await buildSitemapIndexXml());
    }

    if (!/^\d+$/.test(pageParam)) {
        return new Response('Not Found', { status: 404 });
    }

    const entries = await buildSitemapPage(Number(pageParam));
    if (!entries) {
        return new Response('Not Found', { status: 404 });
    }

    return xmlResponse(Sitemap.stringify(entries));
}

function xmlResponse(xml: string) {
    return new Response(xml, {
        headers: {
            'Cache-Control': CACHE_CONTROL,
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
