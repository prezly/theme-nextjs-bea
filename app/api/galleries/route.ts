/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { api } from '@/theme/server';
import { parseNumber } from '@/utils';

export async function GET(request: NextRequest) {
    const { contentDelivery } = api();

    const params = request.nextUrl.searchParams;

    const offset = parseNumber(params.get('offset'));
    const limit = parseNumber(params.get('limit'));

    const { galleries, pagination } = await contentDelivery.galleries({
        offset,
        limit,
    });

    return NextResponse.json({ data: galleries, total: pagination.matched_records_number });
}
