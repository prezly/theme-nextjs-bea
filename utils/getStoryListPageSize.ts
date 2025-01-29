import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { ThemeSettings } from 'theme-settings';

export function getStoryListPageSize(layout: ThemeSettings['layout']) {
    if (layout === 'masonry') {
        return DEFAULT_PAGE_SIZE + 1;
    }

    return DEFAULT_PAGE_SIZE;
}
