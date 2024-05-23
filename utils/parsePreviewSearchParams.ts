import type { Font, ThemeSettings } from 'theme-settings';

import { withoutUndefined } from './withoutUndefined';

export function parsePreviewSearchParams(searchParams: URLSearchParams): Partial<ThemeSettings> {
    let show_date: boolean | undefined;
    let show_featured_categories: boolean | undefined;
    let show_subtitle: boolean | undefined;

    if (searchParams.size === 0) {
        return {};
    }

    try {
        const value = searchParams.get('show_date');
        show_date = value ? JSON.parse(value) : undefined;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    try {
        const value = searchParams.get('show_featured_categories');
        show_featured_categories = value ? JSON.parse(value) : undefined;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    try {
        const value = searchParams.get('show_subtitle');
        show_subtitle = value ? JSON.parse(value) : undefined;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    const font = searchParams.get('font');
    const header_background_color = searchParams.get('header_background_color');
    const header_link_color = searchParams.get('header_link_color');
    const logo_size = searchParams.get('logo_size');

    const settings: Partial<ThemeSettings> = {
        accent_color: searchParams.get('accent_color') ?? undefined,
        font: font ? (font as Font) : undefined,
        header_background_color: header_background_color ?? undefined,
        header_link_color: header_link_color ?? undefined,
        logo_size: logo_size ?? undefined,
        show_date,
        show_featured_categories,
        show_subtitle,
    };

    return withoutUndefined(settings);
}
