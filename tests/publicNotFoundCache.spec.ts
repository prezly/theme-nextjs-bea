import { expect, test } from '@playwright/test';
import { createPrezlyClient } from '@prezly/sdk';
import { ContentDelivery } from '@prezly/theme-kit-nextjs';

import {
    isPublicNotFoundCandidate,
    observePublicStoryLookup,
} from '../src/adapters/server/public-not-found-cache';

const request = (
    url = 'https://example.test/missing',
    headers: Record<string, string> = {},
    method = 'GET',
) => ({ url, headers: new Headers(headers), method });

test('only anonymous public HTML request context can opt in', () => {
    expect(isPublicNotFoundCandidate(request(), undefined)).toBe(true);
    expect(
        isPublicNotFoundCandidate(
            request('https://example.test/missing?utm_source=test'),
            undefined,
        ),
    ).toBe(true);
    expect(isPublicNotFoundCandidate(request(undefined, {}, 'HEAD'), undefined)).toBe(true);
    expect(isPublicNotFoundCandidate(request(), 'preview')).toBe(false);
    expect(isPublicNotFoundCandidate(request(undefined, {}, 'POST'), undefined)).toBe(false);
    for (const query of ['preview', '%70review=1', 'token=private', 'unknown=1']) {
        expect(
            isPublicNotFoundCandidate(request(`https://example.test/missing?${query}`), undefined),
        ).toBe(false);
    }
    for (const name of [
        'Cookie',
        'Authorization',
        'RSC',
        'Next-Router-State-Tree',
        'Next-Router-Prefetch',
        'Next-Router-Segment-Prefetch',
        'X-Middleware-Prefetch',
        'X-Now-Route-Matches',
        'X-Fresh',
        'X-Prezly-Negative-Cache-Bypass',
    ]) {
        expect(
            isPublicNotFoundCandidate(request(undefined, { [name]: '1' }), undefined),
            name,
        ).toBe(false);
    }
});

for (const status of [403, 404, 410]) {
    test(`real SDK/ContentDelivery null from API ${status} only grants a policy for 404`, async () => {
        let requests = 0;
        const result = await observePublicStoryLookup(
            (fetch) => {
                const client = createPrezlyClient({ accessToken: 'fixture-token', fetch });
                return ContentDelivery.createClient(client, 'fixture-newsroom', undefined).story({
                    slug: 'missing',
                });
            },
            async () => {
                requests += 1;
                return Response.json(
                    { message: 'fixture unavailable', status: 'error' },
                    { status },
                );
            },
        );
        expect(requests).toBe(1);
        expect(result.story).toBeNull();
        expect(result.confirmedNotFound).toBe(status === 404);
    });
}

for (const status of [401, 429, 500, 503]) {
    test(`API ${status} propagates without granting a negative-cache policy`, async () => {
        await expect(
            observePublicStoryLookup(
                (fetch) => {
                    const client = createPrezlyClient({ accessToken: 'fixture-token', fetch });
                    return ContentDelivery.createClient(
                        client,
                        'fixture-newsroom',
                        undefined,
                    ).story({ slug: 'missing' });
                },
                async () =>
                    Response.json({ message: 'fixture failure', status: 'error' }, { status }),
            ),
        ).rejects.toThrow();
    });
}

test('successful lookups and transport failures never grant the policy', async () => {
    const result = await observePublicStoryLookup(
        async (fetch) => {
            const response = await fetch('https://fixture.test/story');
            return response.json();
        },
        async () => Response.json({ slug: 'published' }),
    );
    expect(result.story).toEqual({ slug: 'published' });
    expect(result.confirmedNotFound).toBe(false);
    await expect(
        observePublicStoryLookup(
            async (fetch) => {
                await fetch('https://fixture.test/story');
                return null;
            },
            async () => {
                throw new Error('fixture timeout');
            },
        ),
    ).rejects.toThrow('fixture timeout');
});

test('null without an observed response, including shared/cache hits, fails closed', async () => {
    const result = await observePublicStoryLookup(
        async () => null,
        async () => {
            throw new Error('must not fetch');
        },
    );
    expect(result.confirmedNotFound).toBe(false);
});

test('observation is isolated between concurrent requests', async () => {
    const results = await Promise.all(
        [404, 403].map((status) =>
            observePublicStoryLookup(
                async (fetch) => {
                    await fetch('https://fixture.test/story');
                    return null;
                },
                async () => new Response(null, { status }),
            ),
        ),
    );
    expect(results.map((result) => result.confirmedNotFound)).toEqual([true, false]);
});
