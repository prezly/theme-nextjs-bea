import { expect, test } from '@playwright/test';

import { replaceEnvHeaderWithNewsroomTag } from '../src/telemetry/sentry';

const NEWSROOM = '11111111-2222-3333-4444-555555555555';
const ENV_HEADER = JSON.stringify({
    PREZLY_ACCESS_TOKEN: 'secret-access-token',
    PREZLY_NEWSROOM_UUID: NEWSROOM,
    MEILISEARCH_API_KEY: 'secret-search-key',
});

let processNewsroom: string | undefined;

test.beforeEach(() => {
    processNewsroom = process.env.PREZLY_NEWSROOM_UUID;
    delete process.env.PREZLY_NEWSROOM_UUID;
});

test.afterEach(() => {
    if (processNewsroom === undefined) {
        delete process.env.PREZLY_NEWSROOM_UUID;
    } else {
        process.env.PREZLY_NEWSROOM_UUID = processNewsroom;
    }
});

for (const name of ['x-prezly-env', 'X-Prezly-Env']) {
    test(`swaps the ${name} request header for the newsroom tag`, () => {
        const event = replaceEnvHeaderWithNewsroomTag({
            tags: { prezly_theme: 'bea-next' },
            request: {
                url: 'https://example.test/story',
                headers: { host: 'example.test', [name]: ENV_HEADER },
            },
        });

        expect(event.request?.headers).toEqual({ host: 'example.test' });
        expect(event.tags).toEqual({ prezly_theme: 'bea-next', prezly_newsroom: NEWSROOM });
        expect(JSON.stringify(event)).not.toContain('secret-');
    });
}

test('reads the newsroom from a data URL header', () => {
    const header = `data:application/json;base64,${Buffer.from(ENV_HEADER).toString('base64')}`;
    const event = replaceEnvHeaderWithNewsroomTag({
        request: { headers: { 'x-prezly-env': header } },
    });

    expect(event.request?.headers).toEqual({});
    expect(event.tags).toEqual({ prezly_newsroom: NEWSROOM });
});

test('removes the header from span attributes', () => {
    const attribute = 'http.request.header.x_prezly_env';
    const event = replaceEnvHeaderWithNewsroomTag({
        type: 'transaction',
        contexts: {
            trace: {
                trace_id: 'trace',
                span_id: 'root',
                data: { [attribute]: ENV_HEADER, 'http.request.header.host': 'example.test' },
            },
        },
        spans: [
            {
                trace_id: 'trace',
                span_id: 'child',
                start_timestamp: 0,
                data: { [attribute]: ENV_HEADER },
            },
        ],
    });

    expect(event.contexts?.trace?.data).toEqual({ 'http.request.header.host': 'example.test' });
    expect(event.spans?.[0]?.data).toEqual({});
    expect(JSON.stringify(event)).not.toContain('secret-');
});

test('falls back to the newsroom of a single-newsroom deployment', () => {
    process.env.PREZLY_NEWSROOM_UUID = NEWSROOM;

    const event = replaceEnvHeaderWithNewsroomTag({ request: { headers: {} } });

    expect(event.tags).toEqual({ prezly_newsroom: NEWSROOM });
});

test('leaves an event without a known newsroom untagged', () => {
    const event = replaceEnvHeaderWithNewsroomTag({ message: 'Out of request' });

    expect(event).toEqual({ message: 'Out of request' });
});
