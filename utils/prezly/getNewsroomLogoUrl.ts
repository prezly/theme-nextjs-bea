import type { Newsroom } from '@prezly/sdk';

import getAssetsUrl from './getAssetsUrl';

export function getNewsroomLogoUrl(newsroom: Newsroom): string {
    if (newsroom.newsroom_logo) {
        getAssetsUrl(newsroom.newsroom_logo.uuid);
    }

    return '';
}

export function getNewsroomFaviconUrl(newsroom: Newsroom, previewSize = 400): string {
    if (newsroom.icon) {
        return `${getAssetsUrl(
            newsroom.icon.uuid,
        )}-/preview/${previewSize}x${previewSize}/-/quality/best/`;
    }

    return '';
}
