'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useEffect } from 'react';

import { useThemeSettingsWithPreview } from '@/hooks';
import type { ThemeSettings } from 'theme-settings';

import { BrandingSettings } from './BrandingSettings';

const STORAGE_KEY = 'themePreview';

interface Props {
    settings: ThemeSettings;
}

export function DynamicPreviewBranding({ settings }: Props) {
    const themeSettings = useThemeSettingsWithPreview();
    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    useEffect(() => {
        setPreviewSettings(themeSettings);
    }, [setPreviewSettings, themeSettings]);

    if (Object.keys(previewSettings).length === 0) {
        return null;
    }

    return <BrandingSettings settings={{ ...settings, ...previewSettings }} />;
}
