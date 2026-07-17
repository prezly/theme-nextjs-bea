import { routing } from '@prezly/sdk';
import { type NextRequest, NextResponse } from 'next/server';

import { environment } from '@/adapters/server';

const PREZLY_API_URL = 'https://api.prezly.com';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Props {
    params: Promise<{ uuid: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
    const { uuid } = await params;

    if (!UUID_PATTERN.test(uuid)) {
        return new NextResponse('Bad Request', { status: 400 });
    }

    const env = environment(request.headers);

    const { PREZLY_ACCESS_TOKEN, PREZLY_API_BASEURL = PREZLY_API_URL } = env;
    const STORIES_ENDPOINT = `${PREZLY_API_BASEURL}${routing.storiesUrl}`;

    const response = await fetch(`${STORIES_ENDPOINT}/${uuid}`, {
        headers: {
            Authorization: `Bearer ${PREZLY_ACCESS_TOKEN}`,
            Accept: 'application/pdf',
        },
        redirect: 'manual',
    });

    return NextResponse.json({ url: response.headers.get('location') });
}
