import type { ThemeSettingsApiResponse } from 'types';

interface ThemeSettingsQuery extends Omit<ThemeSettingsApiResponse, 'show_date' | 'show_subtitle'> {
    show_date: string;
    show_subtitle: string;
}

export function parseQuery(query: Partial<ThemeSettingsQuery>): Partial<ThemeSettingsApiResponse> {
    let show_date: boolean | undefined;
    let show_subtitle: boolean | undefined;

    if (Object.keys(query).length === 0) {
        return {};
    }

    try {
        show_date = query.show_date ? JSON.parse(query.show_date) : undefined;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    try {
        show_subtitle = query.show_subtitle ? JSON.parse(query.show_subtitle) : undefined;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    const settings = {
        accent_color: query.accent_color,
        font: query.font,
        header_background_color: query.header_background_color,
        header_link_color: query.header_link_color,
        show_date,
        show_subtitle,
    };

    return Object.fromEntries(
        Object.entries(settings).filter(([, value]) => typeof value !== 'undefined'),
    );
}
