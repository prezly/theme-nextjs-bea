/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { api } from '@/theme-kit';
import { parseNumber } from '@/utils';

export async function GET(request: NextRequest) {
    const { contentDelivery } = api();

    const params = request.nextUrl.searchParams;

    const { stories, pagination } = await contentDelivery.stories({
        offset: parseNumber(params.get('offset')),
        limit: parseNumber(params.get('limit')),
    });

    return NextResponse.json({ data: stories, total: pagination.matched_records_number });
}
