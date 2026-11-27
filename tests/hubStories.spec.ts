import { expect, test } from '@playwright/test';
import { createPrezlyClient } from '@prezly/sdk';

import { fetchHubStories } from '../src/adapters/server/hub-stories';

const params = { offset: 0, limit: 12, locale: 'en' } as const;

function createRecordingClient() {
    const requests: Array<{ method: string; url: string; body: unknown }> = [];
    const client = createPrezlyClient({
        accessToken: 'synthetic-test-token',
        baseUrl: 'https://isolated-api.example.test',
        fetch: async (input, init) => {
            const url = String(input);
            requests.push({
                method: init?.method ?? 'GET',
                url,
                body: init?.body ? JSON.parse(String(init.body)) : undefined,
            });
            const payload = url.endsWith('/hub')
                ? {
                      members: [
                          {
                              newsroom: { uuid: 'shown', status: 'active' },
                              is_displaying_stories_in_hub: true,
                          },
                          {
                              newsroom: { uuid: 'hidden', status: 'active' },
                              is_displaying_stories_in_hub: false,
                          },
                          {
                              newsroom: { uuid: 'archived', status: 'archived' },
                              is_displaying_stories_in_hub: true,
                          },
                      ],
                  }
                : { stories: [{ uuid: 'story' }], pagination: { matched_records_number: 1 } };
            return new Response(JSON.stringify(payload), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        },
    });
    return { client, requests };
}

test('a site that is not a hub has no hub stories and makes no API calls', async () => {
    const { client, requests } = createRecordingClient();

    expect(await fetchHubStories(client, { uuid: 'site', is_hub: false }, params)).toBeNull();
    expect(requests).toEqual([]);
});

test('a hub lists its own stories and those of active members shown in the hub', async () => {
    const { client, requests } = createRecordingClient();

    expect(await fetchHubStories(client, { uuid: 'hub', is_hub: true }, params)).toEqual({
        stories: [{ uuid: 'story' }],
        total: 1,
    });
    expect(requests.map(({ method, url }) => `${method} ${url}`)).toEqual([
        'GET https://isolated-api.example.test/v2/newsrooms/hub/hub',
        'POST https://isolated-api.example.test/v2/stories/search',
    ]);
    expect(requests[1].body).toMatchObject({
        limit: 12,
        offset: 0,
        query: { $and: expect.arrayContaining([{ 'newsroom.uuid': { $in: ['hub', 'shown'] } }]) },
    });
});
