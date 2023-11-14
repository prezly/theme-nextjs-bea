/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Locale } from '@prezly/theme-kit-intl';
import { type NextRequest, NextResponse } from 'next/server';

import { app } from '@/theme/server';
import { parseNumber } from '@/utils';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const offset = parseNumber(params.get('offset'));
    const limit = parseNumber(params.get('limit'));
    const locale = params.get('locale') as Locale.Code | null;
    const categoryId = parseNumber(params.get('category'));

    const { stories, pagination } = await app().stories({
        offset,
        limit,
        category: categoryId ? { id: categoryId } : undefined,
        locale: locale ? { code: locale } : undefined,
    });

    return NextResponse.json({ data: stories, total: pagination.matched_records_number });
}
