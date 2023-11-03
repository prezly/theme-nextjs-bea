'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import type { ThemeSettings } from 'types';

import { BrandingSettings } from './BrandingSettings';
import { parseQuery } from './parseQuery';

const STORAGE_KEY = 'themePreview';

interface Props {
    faviconUrl: string | undefined;
    settings: Partial<ThemeSettings>;
}

export function DynamicPreviewBranding({ faviconUrl, settings }: Props) {
    const searchParams = JSON.stringify(useSearchParams());

    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    const compiledSettings: Partial<ThemeSettings> = {
        ...settings,
        ...previewSettings,
    };

    useEffect(() => {
        if (searchParams) {
            setPreviewSettings(parseQuery(JSON.parse(searchParams)));
        }
    }, [searchParams, setPreviewSettings]);

    return <BrandingSettings faviconUrl={faviconUrl} settings={compiledSettings} />;
}
