import { ThemeSettingsAdapter } from '@prezly/theme-kit-nextjs/adapters/client';

import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from 'theme-settings';

export const { useThemeSettings, ThemeSettingsProvider } =
    ThemeSettingsAdapter.connect<ThemeSettings>({
        defaults: DEFAULT_THEME_SETTINGS,
    });
