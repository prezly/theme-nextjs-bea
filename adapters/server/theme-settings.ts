import { ThemeSettingsAdapter } from '@prezly/theme-kit-nextjs/server';

import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from 'theme-settings';

export const { useThemeSettings: themeSettings } = ThemeSettingsAdapter.connect<ThemeSettings>({
    defaults: DEFAULT_THEME_SETTINGS,
    settings: () => ({
        accent_color: '#0082DB',
        font: 'roboto',
        header_background_color: '#76ce7a',
        header_link_color: '#225028',
        show_date: true,
        show_subtitle: true,
    }),
});
