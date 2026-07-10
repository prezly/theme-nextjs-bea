import { expect, test } from '@playwright/test';
import type { Newsroom, NewsroomRef } from '@prezly/sdk';

import { sanitizeNewsroom, sanitizeNewsroomRef } from '@/utils';

test('only exposes allowlisted newsroom fields to client components', () => {
    const newsroom = {
        active_theme_preset: {
            settings: {
                custom_javascript: 'sensitive',
                header_background_color: '#fff',
                header_link_color: '#000',
            },
        },
        display_name: 'Prezly',
        is_hub: false,
        links: { edit: 'https://rock.prezly.com/internal' },
        name: 'Prezly',
        newsroom_logo: null,
        plausible_shared_link: 'https://plausible.io/share/private',
        public_galleries_number: 1,
        square_logo: null,
        stories_number: 2,
        url: 'https://example.com',
        uuid: 'newsroom-uuid',
    } as unknown as Newsroom;

    expect(sanitizeNewsroom(newsroom)).toEqual({
        active_theme_preset: {
            settings: {
                header_background_color: '#fff',
                header_link_color: '#000',
            },
        },
        display_name: 'Prezly',
        is_hub: false,
        name: 'Prezly',
        newsroom_logo: null,
        public_galleries_number: 1,
        square_logo: null,
        stories_number: 2,
        url: 'https://example.com',
        uuid: 'newsroom-uuid',
    });
});

test('only exposes routing fields on story newsroom references', () => {
    const newsroom = {
        display_name: 'Prezly',
        links: { edit: 'https://rock.prezly.com/internal' },
        plausible_shared_link: 'https://plausible.io/share/private',
        url: 'https://example.com',
        uuid: 'newsroom-uuid',
    } as unknown as NewsroomRef;

    expect(sanitizeNewsroomRef(newsroom)).toEqual({
        url: 'https://example.com',
        uuid: 'newsroom-uuid',
    });
});
