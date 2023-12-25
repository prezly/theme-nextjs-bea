import type { ThemeSettingsApiResponse } from 'types';

interface ThemeSettingsQuery extends Omit<ThemeSettingsApiResponse, 'show_date' | 'show_subtitle'> {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    show_date: string;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    show_subtitle: string;
}

export function parseQuery(query: Partial<ThemeSettingsQuery>): Partial<ThemeSettingsApiResponse> {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    let show_date: boolean | undefined;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    let show_subtitle: boolean | undefined;

    if (Object.keys(query).length === 0) {
        return {};
    }

    try {
        show_date = query.show_date ? JSON.parse(query.show_date) : undefined;
    } catch (_error) {
        // NOOP
    }

    try {
        show_subtitle = query.show_subtitle ? JSON.parse(query.show_subtitle) : undefined;
    } catch (_error) {
        // NOOP
    }

    const settings: Partial<ThemeSettingsApiResponse> = {
        // biome-ignore lint/style/useNamingConvention: <explanation>
        accent_color: query.accent_color,
        font: query.font,
        // biome-ignore lint/style/useNamingConvention: <explanation>
        header_background_color: query.header_background_color,
        // biome-ignore lint/style/useNamingConvention: <explanation>
        header_link_color: query.header_link_color,
        show_date,
        show_subtitle,
    };

    return Object.fromEntries(
        Object.entries(settings).filter(([, value]) => typeof value !== 'undefined'),
    );
}
