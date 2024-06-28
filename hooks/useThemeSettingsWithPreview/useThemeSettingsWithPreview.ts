'use client';

import { useMemo } from 'react';

import { useThemeSettings } from 'adapters/client/theme-settings';
import type { ThemeSettings } from 'theme-settings';

export function useThemeSettingsWithPreview(): ThemeSettings {
    const themeSettings = useThemeSettings();

    const settings = useMemo(
        () => ({
            ...themeSettings,
        }),
        [themeSettings],
    );

    return settings;
}
