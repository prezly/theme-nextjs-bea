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

    useEffect(() => {
        setPreviewSettings(parsedPreviewSettings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(parsedPreviewSettings), setPreviewSettings]);

    if (!previewSettings || Object.keys(previewSettings).length === 0) {
        return null;
    }

    return <BrandingSettings settings={{ ...previewSettings }} />;
}
