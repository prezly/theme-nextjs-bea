import { ThemeSettingsAdapter } from '@prezly/theme-kit-nextjs/adapters/server';

import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from 'theme-settings';

import { api } from './api';

export const { useThemeSettings: themeSettings } = ThemeSettingsAdapter.connect<ThemeSettings>({
    defaults: DEFAULT_THEME_SETTINGS,
    settings: () => api().contentDelivery.themeSettings(),
});
