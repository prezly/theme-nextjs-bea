import type { Font, ThemeSettings } from 'theme-settings';

import { parseBoolean } from './parseBoolean';
import { withoutUndefined } from './withoutUndefined';

type PreviewSearchParams = Partial<Record<keyof ThemeSettings, string>>;

export function parsePreviewSearchParams(
    previewSearchParams: PreviewSearchParams,
    themeSettings: ThemeSettings,
): ThemeSettings {
    const {
        accent_color,
        font,
        header_background_color,
        header_image_placement,
        header_link_color,
        logo_size,
        main_site_url,
        show_date,
        show_featured_categories,
        show_sharing_icons,
        show_subtitle,
    } = previewSearchParams;

    const settings: Partial<ThemeSettings> = {
        accent_color,
        font: font as Font,
        header_background_color,
        header_image_placement: parseHeaderImagePlacement(header_image_placement),
        header_link_color,
        logo_size,
        main_site_url,
        show_date: show_date ? parseBoolean(show_date) : undefined,
        show_featured_categories: show_featured_categories
            ? parseBoolean(show_featured_categories)
            : undefined,
        show_sharing_icons: show_sharing_icons ? parseBoolean(show_sharing_icons) : undefined,
        show_subtitle: show_subtitle ? parseBoolean(show_subtitle) : undefined,
    };

    return { ...themeSettings, ...withoutUndefined(settings) };
}

function parseHeaderImagePlacement(headerImagePlacement: string | undefined) {
    if (headerImagePlacement === 'above' || headerImagePlacement === 'below') {
        return headerImagePlacement;
    }

    return undefined;
}
