import type { Font, ThemeSettings } from 'theme-settings';

import { parseBoolean } from './parseBoolean';
import { withoutUndefined } from './withoutUndefined';

type PreviewSearchParams = Record<string, string>;

export function parsePreviewSearchParams(
    previewSearchParams: PreviewSearchParams,
    themeSettings: ThemeSettings,
): ThemeSettings {
    const {
        accent_color,
        background_color,
        font,
        footer_background_color,
        footer_text_color,
        full_width_featured_story,
        header_background_color,
        header_image_placement,
        header_link_color,
        layout,
        logo_size,
        main_site_url,
        show_date,
        show_featured_categories,
        show_sharing_icons,
        show_subtitle,
        story_card_variant,
        text_color,
    }: Partial<Record<keyof ThemeSettings, string>> = previewSearchParams;

    const settings: Partial<ThemeSettings> = {
        accent_color,
        background_color,
        font: font as Font,
        footer_background_color,
        footer_text_color,
        full_width_featured_story: full_width_featured_story
            ? parseBoolean(full_width_featured_story)
            : undefined,
        header_background_color,
        header_image_placement: parseHeaderImagePlacement(header_image_placement),
        header_link_color,
        layout: parseLayout(layout),
        logo_size,
        main_site_url,
        show_date: show_date ? parseBoolean(show_date) : undefined,
        show_featured_categories: show_featured_categories
            ? parseBoolean(show_featured_categories)
            : undefined,
        show_sharing_icons: show_sharing_icons ? parseBoolean(show_sharing_icons) : undefined,
        show_subtitle: show_subtitle ? parseBoolean(show_subtitle) : undefined,
        story_card_variant: parseStoryCardVariant(story_card_variant),
        text_color,
    };

    if (process.env.PREZLY_MODE !== 'preview') {
        return themeSettings;
    }

    return { ...themeSettings, ...withoutUndefined(settings) };
}

function parseHeaderImagePlacement(headerImagePlacement: string | undefined) {
    if (headerImagePlacement === 'above' || headerImagePlacement === 'below') {
        return headerImagePlacement;
    }

    return undefined;
}

function parseLayout(layout: string | undefined) {
    if (layout === 'grid' || layout === 'masonry') {
        return layout;
    }

    return undefined;
}

function parseStoryCardVariant(storyCardVariant: string | undefined) {
    if (storyCardVariant === 'default' || storyCardVariant === 'boxed') {
        return storyCardVariant;
    }

    return undefined;
}
