import { useNewsroomContext } from '@prezly/theme-kit-nextjs';
import { useRouter } from 'next/router';

import type { ThemeSettings } from 'types';

import { DEFAULT_THEME_SETTINGS } from './constants';
import { parseQuery } from './utils';

export function useThemeSettings(): ThemeSettings {
    const { query } = useRouter();
    const { themePreset } = useNewsroomContext();

    const settings: ThemeSettings = {
        ...DEFAULT_THEME_SETTINGS,
        ...themePreset?.settings,
        ...parseQuery(query),
    };

    return {
        accent_color: settings.accent_color,
        font: settings.font,
        header_background_color: settings.header_background_color,
        header_link_color: settings.header_link_color,
        show_date: settings.show_date,
        show_subtitle: settings.show_subtitle,
    };
}
