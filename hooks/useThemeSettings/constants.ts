import type { ThemeSettingsApiResponse } from 'types';
import { Font } from 'types';

export const STORAGE_KEY = 'themePreview';

export const DEFAULT_THEME_SETTINGS: ThemeSettingsApiResponse = {
    accent_color: '#3b82f6',
    font: Font.INTER,
    header_background_color: '#ffffff',
    header_link_color: '#4b5563',
    show_date: true,
    show_subtitle: false,
};
