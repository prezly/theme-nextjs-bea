'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { useThemeSettings } from 'adapters/client/theme-settings';
import type { ThemeSettings } from 'theme-settings';

import { parseSearchParams } from './parseSearchParams';

export function useThemeSettingsWithPreview(): ThemeSettings {
    const searchParams = useSearchParams();
    const themeSettings = useThemeSettings();
    const previewSettings = parseSearchParams(searchParams);

    const settings = useMemo(
        () => ({
            ...themeSettings,
            ...previewSettings,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(previewSettings), themeSettings],
    );

    return settings;
}
