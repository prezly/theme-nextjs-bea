import type { Newsroom } from '@prezly/sdk';

import getAssetsUrl from './getAssetsUrl';

export function getNewsroomLogoUrl(newsroom: Newsroom, previewSize = 400): string {
    if (newsroom.newsroom_logo) {
        return `${getAssetsUrl(
            newsroom.newsroom_logo.uuid,
        )}-/preview/${previewSize}x${previewSize}/-/quality/best/`;
    }

    return '';
}
