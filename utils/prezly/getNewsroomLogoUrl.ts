import type { Newsroom } from '@prezly/sdk';

import getAssetsUrl from './getAssetsUrl';

export function getNewsroomLogoUrl(newsroom: Newsroom): string {
    if (newsroom.newsroom_logo) {
        return getAssetsUrl(newsroom.newsroom_logo.uuid);
    }

    return '';
}
