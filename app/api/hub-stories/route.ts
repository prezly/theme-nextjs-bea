import { SortOrder, Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { environment, initPrezlyClient } from '@/adapters/server';
import { parseNumber } from '@/utils';

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const offset = parseNumber(params.get('offset'));
    const limit = parseNumber(params.get('limit')) ?? DEFAULT_LIMIT;
    const locale = params.get('locale') as Locale.Code | null;

    const env = environment(request.headers);
    const includedStoriesClient = initPrezlyClient(request.headers, {
        accessToken: env.PREZLY_INCLUDED_STORIES_ACCESS_TOKEN,
    });

    const { pagination, stories } = await includedStoriesClient.client.stories.search({
        offset,
        limit,
        include: ['thumbnail_image'],
        sortOrder: SortOrder.desc('published_at'),
        query: {
            $and: [
                { [`locale`]: { $in: [locale] } },
                { [`status`]: { $in: [Story.Status.PUBLISHED] } },
                { [`visibility`]: { $in: [Story.Visibility.PUBLIC] } },
            ],
        },
    });

    return NextResponse.json({ data: stories, total: pagination.matched_records_number });
}
