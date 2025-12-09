import { Newsroom, SortOrder, Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { app, environment } from '@/adapters/server';
import { parseLimit, parseOffset } from '@/utils';

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const offset = parseOffset(params.get('offset'));
    const limit = parseLimit(params.get('limit')) ?? DEFAULT_LIMIT;
    const locale = params.get('locale') as Locale.Code | null;

    const env = environment(request.headers);
    const members = await app().client.newsroomHub.list(env.PREZLY_NEWSROOM_UUID);
    const activeAndIncludedMembers = members.filter(
        (member) => Newsroom.isActive(member.newsroom) && member.is_displaying_stories_in_hub,
    );

    const { pagination, stories } = await app().client.stories.search({
        offset,
        limit,
        include: ['thumbnail_image'],
        sortOrder: SortOrder.desc('published_at'),
        query: {
            $and: [
                { locale: { $in: [locale] } },
                { status: { $in: [Story.Status.PUBLISHED] } },
                { visibility: { $in: [Story.Visibility.PUBLIC] } },
                {
                    'newsroom.uuid': {
                        $in: [
                            env.PREZLY_NEWSROOM_UUID,
                            ...activeAndIncludedMembers.map((member) => member.newsroom.uuid),
                        ],
                    },
                },
            ],
        },
    });

    return NextResponse.json({ data: stories, total: pagination.matched_records_number });
}
