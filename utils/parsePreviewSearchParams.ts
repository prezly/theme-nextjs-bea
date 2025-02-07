import type { Font, SharingPlacement, SocialNetwork, ThemeSettings } from 'theme-settings';

import { parseArray } from './parseArray';
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
        sharing_actions,
        sharing_placement,
        show_copy_content,
        show_copy_url,
        show_download_assets,
        show_download_pdf,
        show_read_more,
        show_date,
        show_featured_categories,
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
        sharing_actions: parseArray<SocialNetwork>(
            sharing_actions,
            (item) => String(item) as SocialNetwork,
        ),
        sharing_placement: parseArray<SharingPlacement[number]>(
            sharing_placement,
            (item) => item as SharingPlacement[number],
        ),
        show_copy_content: show_copy_content ? parseBoolean(show_copy_content) : undefined,
        show_copy_url: show_copy_url ? parseBoolean(show_copy_url) : undefined,
        show_download_assets: show_download_assets ? parseBoolean(show_download_assets) : undefined,
        show_download_pdf: show_download_pdf ? parseBoolean(show_download_pdf) : undefined,
        show_read_more: show_read_more ? parseBoolean(show_read_more) : undefined,
        show_date: show_date ? parseBoolean(show_date) : undefined,
        show_featured_categories: show_featured_categories
            ? parseBoolean(show_featured_categories)
            : undefined,
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
