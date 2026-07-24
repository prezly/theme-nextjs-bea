import { routing } from '@prezly/sdk';
import { type NextRequest, NextResponse } from 'next/server';

import { environment, logApiAuthFailure } from '@/adapters/server';

// Default when the `X-Prezly-Env` tenant config does not override it via
// `PREZLY_API_BASEURL` (same convention as the SDK adapter).
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

    if (response.status === 401 || response.status === 403) {
        logApiAuthFailure(response.status, request.headers);
    }

    const url = parsePdfUrl(response.headers.get('location'));

    if (!url) {
        // On success the API responds with a redirect (3xx + Location) to the
        // rendered PDF. Anything else is an upstream failure: pass a missing
        // story through as 404; everything else (including auth failures,
        // which are a tenant configuration problem, not the visitor's) is a
        // bad gateway.
        return new NextResponse(null, { status: response.status === 404 ? 404 : 502 });
    }

    return NextResponse.json({ url });
}

function parsePdfUrl(location: string | null): string | null {
    if (!location) {
        return null;
    }

    try {
        const url = new URL(location);
        return url.protocol === 'https:' ? url.toString() : null;
    } catch {
        return null;
    }
}
