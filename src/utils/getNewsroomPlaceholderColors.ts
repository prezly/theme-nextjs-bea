import type { Newsroom } from '@prezly/sdk';

export function getNewsroomPlaceholderColors(newsroom: Newsroom | undefined) {
    return {
        color: newsroom?.active_theme_preset.settings.header_link_color,
        backgroundColor: newsroom?.active_theme_preset.settings.header_background_color,
    };
}
