import { expect, test } from '@playwright/test';
import type { Story } from '@prezly/sdk';

import { sanitizeStory } from '@/utils';

test('only exposes fields rendered by story list and related story clients', () => {
    const story = {
        author: {
            display_name: 'Private author',
            email: 'author@example.com',
        },
        categories: [{ id: 1 }],
        links: {
            newsroom_preview: 'https://example.com/preview?token=sensitive',
            newsroom_view: 'https://example.com/story',
            short: 'https://example.com/s/story',
        },
        newsroom: {
            display_name: 'Private newsroom data',
            url: 'https://example.com',
            uuid: 'newsroom-uuid',
        },
        oembed: { title: 'Story title' },
        pinned_by: {
            display_name: 'Private pinner',
            email: 'pinner@example.com',
        },
        published_at: '2026-07-15T12:00:00Z',
        slug: 'story-slug',
        subtitle: 'Story subtitle',
        thumbnail_image: '{"uuid":"image-uuid"}',
        title: 'Story title',
        translations: [
            {
                author: { email: 'translator@example.com' },
                uuid: 'translation-uuid',
            },
        ],
        uuid: 'story-uuid',
    } as unknown as Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

    expect(sanitizeStory(story)).toEqual({
        categories: [{ id: 1 }],
        links: {
            newsroom_view: 'https://example.com/story',
        },
        newsroom: {
            url: 'https://example.com',
            uuid: 'newsroom-uuid',
        },
        oembed: { title: 'Story title' },
        published_at: '2026-07-15T12:00:00Z',
        slug: 'story-slug',
        subtitle: 'Story subtitle',
        thumbnail_image: '{"uuid":"image-uuid"}',
        title: 'Story title',
        uuid: 'story-uuid',
    });
});
