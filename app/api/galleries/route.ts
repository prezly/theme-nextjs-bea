import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { app } from '@/adapters/server';
import { parseNumber } from '@/utils';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const offset = parseNumber(params.get('offset'));
    const limit = parseNumber(params.get('limit'));

    const { galleries, pagination } = await app().galleries({
        offset,
        limit,
    });

    return NextResponse.json({ data: galleries, total: pagination.matched_records_number });
}
