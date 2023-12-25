import type { ThemeSettingsApiResponse } from 'types';
import { Font } from 'types';

export const STORAGE_KEY = 'themePreview';

export const DEFAULT_THEME_SETTINGS: ThemeSettingsApiResponse = {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    accent_color: '#3b82f6',
    font: Font.INTER,
    // biome-ignore lint/style/useNamingConvention: <explanation>
    header_background_color: '#ffffff',
    // biome-ignore lint/style/useNamingConvention: <explanation>
    header_link_color: '#4b5563',
    // biome-ignore lint/style/useNamingConvention: <explanation>
    show_date: true,
    // biome-ignore lint/style/useNamingConvention: <explanation>
    show_subtitle: false,
};
