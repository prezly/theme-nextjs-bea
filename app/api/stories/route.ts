import type { Locale } from '@prezly/theme-kit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { app } from '@/adapters/server';
import { parseNumber } from '@/utils';

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const offset = parseNumber(params.get('offset'));
    const limit = parseNumber(params.get('limit')) ?? DEFAULT_LIMIT;
    const locale = params.get('locale') as Locale.Code | null;
    const categoryId = parseNumber(params.get('category'));
    const tag = params.get('tag');

    const { stories, pagination } = await app().stories({
        offset,
        limit,
        category: categoryId ? { id: categoryId } : undefined,
        locale: locale ? { code: locale } : undefined,
        tags: tag ? [tag] : undefined,
    });

    return NextResponse.json({ data: stories, total: pagination.matched_records_number });
}
