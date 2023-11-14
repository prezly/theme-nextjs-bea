'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import type { ThemeSettings } from 'theme-settings';

import { BrandingSettings } from './BrandingSettings';
import { parseQuery } from './parseQuery';

const STORAGE_KEY = 'themePreview';

interface Props {
    settings: ThemeSettings;
}

export function DynamicPreviewBranding({ settings }: Props) {
    const searchParams = JSON.stringify(useSearchParams());

    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    useEffect(() => {
        if (searchParams) {
            setPreviewSettings(parseQuery(JSON.parse(searchParams)));
        }
    }, [searchParams, setPreviewSettings]);

    if (Object.keys(previewSettings).length === 0) {
        return null;
    }

    return <BrandingSettings settings={{ ...settings, ...previewSettings }} />;
}
