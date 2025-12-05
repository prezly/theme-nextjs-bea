import type { Locale } from '@prezly/theme-kit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { app } from '@/adapters/server';
import { clamp, parseInteger } from '@/utils';

const DEFAULT_LIMIT = 20;

const MAX_SAFE_INT = 2147483648; // Max signed 32bit int.

const MIN_LIMIT = 1;
const MAX_LIMIT = 1000;

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    // - `offset` outside the safe range is ignored
    const offset = parseInteger(params.get('offset'), { min: 0, max: MAX_SAFE_INT });

    // - `limit` below 0 is ignored -- default limit is applied
    // - `limit` above `MAX_LIMIT` is capped to `MAX_LIMIT`
    const limit =
        clamp(parseInteger(params.get('limit'), { min: MIN_LIMIT }), { max: MAX_LIMIT }) ??
        DEFAULT_LIMIT;

    const locale = params.get('locale') as Locale.Code | null;

    const categoryId = parseInteger(params.get('category'), {
        min: 1,
        max: MAX_SAFE_INT,
    });

    const tag = params.get('tag');

    const { stories, pagination } = await app().stories({
        offset,
        limit,
        categories: categoryId ? [{ id: categoryId }] : undefined,
        locale: locale ? { code: locale } : undefined,
        tags: tag ? [tag] : undefined,
    });

    return NextResponse.json({ data: stories, total: pagination.matched_records_number });
}
