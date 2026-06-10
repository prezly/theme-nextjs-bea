import { ThemeSettingsAdapter } from '@prezly/theme-kit-nextjs/server';

import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from '@/theme-settings';

// For this custom Neumann theme, we use hardcoded settings instead of pulling from API
export const { useThemeSettings: themeSettings } = ThemeSettingsAdapter.connect<ThemeSettings>({
    defaults: DEFAULT_THEME_SETTINGS,
    // Return empty object to use only defaults - no API settings override
    settings: () => Promise.resolve({}),
});
