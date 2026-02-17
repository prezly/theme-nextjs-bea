'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import type { ThemeSettings } from '@/theme-settings';
import { decodePreviewHash, parsePreviewSearchParams } from '@/utils';

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
        // Only overwrite sessionStorage when there are actual search param overrides,
        // so we don't clobber hash-derived settings on subsequent page navigations.
        if (Object.keys(parsedPreviewSettings).length > 0) {
            setPreviewSettings(parsedPreviewSettings);
        }
    }, [setPreviewSettings, JSON.stringify(parsedPreviewSettings)]);

    // Seed from URL hash (standalone preview links — overrides search params)
    // biome-ignore lint/correctness/useExhaustiveDependencies: <run once on mount to read hash before postMessage arrives>
    useEffect(() => {
        const hashSettings = decodePreviewHash(window.location.hash);
        if (hashSettings) {
            const parsed = parsePreviewSearchParams(hashSettings, settings);
            setPreviewSettings(parsed);
        }
    }, []);

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
