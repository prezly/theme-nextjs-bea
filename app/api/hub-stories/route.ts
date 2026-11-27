import type { Locale } from '@prezly/theme-kit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { app, fetchHubStories } from '@/adapters/server';
import { parseLimit, parseOffset, sanitizeStories } from '@/utils';

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const result = await fetchHubStories(app().client, await app().newsroom(), {
        offset: parseOffset(params.get('offset')),
        limit: parseLimit(params.get('limit')) ?? DEFAULT_LIMIT,
        locale: params.get('locale') as Locale.Code | null,
    });

    if (!result) {
        // Not a hub: answer like any unknown API route (see `app/api/[...catch]/route.ts`).
        return new Response('404 Not Found', { status: 404, statusText: 'Not Found' });
    }

    return NextResponse.json({
        data: sanitizeStories(result.stories),
        total: result.total,
    });
}
