'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import type { ThemeSettings } from '@/theme-settings';
import { parsePreviewSearchParams } from '@/utils';

import { BrandingSettings } from './BrandingSettings';

const STORAGE_KEY = 'themePreview';

interface Props {
    settings: ThemeSettings;
}

export function DynamicPreviewBranding({ settings }: Props) {
    const searchParams = useSearchParams();
    const searchParamsObject = useMemo(
        () =>
            Array.from(searchParams.entries()).reduce(
                (result, [key, value]) => ({
                    ...result,
                    [key]: value,
                }),
                {},
            ),
        [searchParams],
    );
    const parsedPreviewSettings = parsePreviewSearchParams(searchParamsObject, settings);

    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    // biome-ignore lint/correctness/useExhaustiveDependencies: <parsedPreviewSettings is recreated with every render, so we compare serialized value>
    useEffect(() => {
        setPreviewSettings(parsedPreviewSettings);
    }, [setPreviewSettings, JSON.stringify(parsedPreviewSettings)]);

    // Listen for settings updates via postMessage (avoids URL length limits and iframe reloads)
    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.data?.type === 'settingsUpdate') {
                const parsed = parsePreviewSearchParams(event.data.settings, settings);
                setPreviewSettings(parsed);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [settings, setPreviewSettings]);

    if (!previewSettings || Object.keys(previewSettings).length === 0) {
        return null;
    }

    return <BrandingSettings settings={{ ...previewSettings }} />;
}
