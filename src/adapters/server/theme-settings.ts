import { ThemeSettingsAdapter } from '@prezly/theme-kit-nextjs/server';

import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from '@/theme-settings';

// import { initPrezlyClient } from './prezly';

export const { useThemeSettings: themeSettings } = ThemeSettingsAdapter.connect<ThemeSettings>({
    defaults: DEFAULT_THEME_SETTINGS,
    // FIXME: Commented out because the Oona hub room does not have theme settings since it's not running
    // on the Bea theme in the app.
    // settings: () => initPrezlyClient().contentDelivery.themeSettings(),
    settings: () => DEFAULT_THEME_SETTINGS,
});
