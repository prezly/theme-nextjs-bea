'use client';

import { useSessionStorageValue } from '@react-hookz/web';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { usePreviewSettingsContext } from '@/modules/Broadcast';
import type { ThemeSettings } from '@/theme-settings';
import { parsePreviewSearchParams } from '@/utils';

import { BrandingSettings } from './BrandingSettings';

const STORAGE_KEY = 'themePreview';

interface Props {
    settings: ThemeSettings;
}

export function DynamicPreviewBranding({ settings }: Props) {
    const searchParams = useSearchParams();
    const { settings: rawPreviewSettings } = usePreviewSettingsContext();
    const searchParamsObject = useMemo(
        () => Object.fromEntries(searchParams.entries()),
        [searchParams],
    );
    const parsedFromUrl = parsePreviewSearchParams(searchParamsObject, settings);
    const parsedFromMessage = rawPreviewSettings
        ? parsePreviewSearchParams(rawPreviewSettings, settings)
        : null;

    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    // Sync URL search params (only when actual query params are present)
    // biome-ignore lint/correctness/useExhaustiveDependencies: <parsedFromUrl is recreated with every render, so we compare serialized value>
    useEffect(() => {
        if (Object.keys(searchParamsObject).length > 0) {
            setPreviewSettings(parsedFromUrl);
        }
    }, [setPreviewSettings, JSON.stringify(parsedFromUrl)]);

    // Sync context settings (takes priority over URL params)
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
