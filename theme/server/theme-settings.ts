import { integrateThemeSettings } from '@/theme-kit/server';
import { DEFAULT_THEME_SETTINGS } from 'theme-settings';

import { api } from './api';

export const { useThemeSettings: themeSettings } = integrateThemeSettings({
    defaults: DEFAULT_THEME_SETTINGS,
    settings: () => api().contentDelivery.themeSettings(),
});
