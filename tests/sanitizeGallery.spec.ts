import { expect, test } from '@playwright/test';
import type { NewsroomGallery } from '@prezly/sdk';

import { sanitizeGallery } from '@/utils';

test('only exposes fields rendered by gallery list clients', () => {
    const gallery = {
        creator: {
            display_name: 'Private creator',
            email: 'creator@example.com',
        },
        images: [{ uploadcare_image: { uuid: 'image-uuid' } }],
        name: 'Press kit',
        status: 'public',
        thumbnail_image: null,
        url: 'https://rock.prezly.com/internal',
        uuid: 'gallery-uuid',
    } as unknown as NewsroomGallery;

    expect(sanitizeGallery(gallery)).toEqual({
        images: [{ uploadcare_image: { uuid: 'image-uuid' } }],
        name: 'Press kit',
        thumbnail_image: null,
        uuid: 'gallery-uuid',
    });
});
