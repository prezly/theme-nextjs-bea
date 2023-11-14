import { integrateThemeSettings } from '@/theme-kit/client';
import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from 'theme-settings';

export const { useThemeSettings, ThemeSettingsProvider } = integrateThemeSettings<ThemeSettings>({
    defaults: DEFAULT_THEME_SETTINGS,
});
