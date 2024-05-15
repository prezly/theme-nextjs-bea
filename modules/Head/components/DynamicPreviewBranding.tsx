'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import type { ThemeSettings } from 'theme-settings';

import { BrandingSettings } from './BrandingSettings';
import { parseSearchParams } from './parseSearchParams';

const STORAGE_KEY = 'themePreview';

interface Props {
    settings: ThemeSettings;
}

export function DynamicPreviewBranding({ settings }: Props) {
    const searchParams = useSearchParams();

    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    useEffect(() => {
        if (searchParams.size > 0) {
            setPreviewSettings(parseSearchParams(searchParams));
        }
    }, [searchParams, setPreviewSettings]);

    if (Object.keys(previewSettings).length === 0) {
        return null;
    }

    return <BrandingSettings settings={{ ...settings, ...previewSettings }} />;
}
