import type { PublicNewsroom } from './sanitizeNewsroom';

export function getNewsroomPlaceholderColors(newsroom: PublicNewsroom | undefined) {
    return {
        color: newsroom?.active_theme_preset.settings.header_link_color,
        backgroundColor: newsroom?.active_theme_preset.settings.header_background_color,
    };
}
