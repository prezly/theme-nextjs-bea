'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { ThemeSettings } from '@/theme-settings';
import { decodePreviewHash, parsePreviewSearchParams } from '@/utils';

import { BrandingSettings } from './BrandingSettings';

const STORAGE_KEY = 'themePreview';

interface Props {
    settings: ThemeSettings;
}

export function DynamicPreviewBranding({ settings }: Props) {
    const searchParams = useSearchParams();
    const [rawPreviewSettings, setRawPreviewSettings] = useState<Record<string, string> | null>(
        null,
    );
    const searchParamsObject = useMemo(
        () => Object.fromEntries(searchParams.entries()),
        [searchParams],
    );
    const parsedFromUrl = parsePreviewSearchParams(searchParamsObject, settings);
    const parsedFromMessage = rawPreviewSettings
        ? parsePreviewSearchParams(rawPreviewSettings, settings)
        : null;

    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    // Seed from URL hash (standalone preview links)
    useEffect(() => {
        const hashSettings = decodePreviewHash(window.location.hash);
        if (hashSettings) {
            const parsed = parsePreviewSearchParams(hashSettings, settings);
            setPreviewSettings(parsed);
        }
    }, [settings, setPreviewSettings]);

    // Sync URL search params (only when actual query params are present)
    // biome-ignore lint/correctness/useExhaustiveDependencies: <parsedFromUrl is recreated with every render, so we compare serialized value>
    useEffect(() => {
        if (Object.keys(searchParamsObject).length > 0) {
            setPreviewSettings(parsedFromUrl);
        }
    }, [setPreviewSettings, JSON.stringify(parsedFromUrl)]);

    // Listen for settings updates via postMessage directly.
    // This component renders in <head>, outside the BroadcastPreviewSettingsProvider
    // tree in <body>, so it cannot use the shared context.
    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.data?.type === 'settingsUpdate') {
                setRawPreviewSettings(event.data.settings);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Sync postMessage settings (takes priority over URL params)
    // biome-ignore lint/correctness/useExhaustiveDependencies: <parsedFromMessage is recreated with every render, so we compare serialized value>
    useEffect(() => {
        if (parsedFromMessage && Object.keys(parsedFromMessage).length > 0) {
            setPreviewSettings(parsedFromMessage);
        }
    }, [setPreviewSettings, JSON.stringify(parsedFromMessage)]);

    if (!previewSettings || Object.keys(previewSettings).length === 0) {
        return null;
    }

    return <BrandingSettings settings={{ ...previewSettings }} />;
}
