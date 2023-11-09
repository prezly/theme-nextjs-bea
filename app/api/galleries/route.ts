/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { api } from '@/theme-kit';

export async function GET(request: NextRequest) {
    const { contentDelivery } = api();

    const params = request.nextUrl.searchParams;

    const { galleries, pagination } = await contentDelivery.galleries({
        offset: toNumber(params.get('offset')),
        limit: toNumber(params.get('limit')),
    });

    return NextResponse.json({ data: galleries, total: pagination.total_records_number });
}

function toNumber(value: string | null): number | undefined {
    if (value) {
        const number = Number(value);
        return !Number.isNaN(number) ? number : undefined;
    }
    return undefined;
}
