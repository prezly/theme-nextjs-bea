import { integrateThemeSettings } from '@/theme-kit/client';
import { DEFAULT_THEME_SETTINGS } from 'theme-settings';

export const { useThemeSettings, ThemeSettingsProvider } = integrateThemeSettings({
    defaults: DEFAULT_THEME_SETTINGS,
});
