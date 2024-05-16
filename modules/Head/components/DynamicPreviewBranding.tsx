'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import type { ThemeSettings } from 'theme-settings';
import { parsePreviewSearchParams } from 'utils';

import { BrandingSettings } from './BrandingSettings';

const STORAGE_KEY = 'themePreview';

interface Props {
    settings: ThemeSettings;
}

export function DynamicPreviewBranding({ settings }: Props) {
    const searchParams = useSearchParams();
    const parsedPreviewSettings = parsePreviewSearchParams(searchParams);

    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    useEffect(() => {
        setPreviewSettings(parsedPreviewSettings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(parsedPreviewSettings), setPreviewSettings]);

    if (Object.keys(previewSettings).length === 0) {
        return null;
    }

    return <BrandingSettings settings={{ ...settings, ...previewSettings }} />;
}
