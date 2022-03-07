import { useNewsroomContext } from '@prezly/theme-kit-nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSessionStorage } from 'react-use';

import type { ThemeSettings } from 'types';

import { DEFAULT_THEME_SETTINGS, STORAGE_KEY } from './constants';
import { parseQuery } from './utils';

export function useThemeSettings(): ThemeSettings {
    const { query } = useRouter();
    const { themePreset } = useNewsroomContext();
    const [previewSettings, setPreviewSettings] = useSessionStorage(STORAGE_KEY, {});

    const settings: ThemeSettings = {
        ...DEFAULT_THEME_SETTINGS,
        ...themePreset?.settings,
        ...previewSettings,
    };

    useEffect(() => {
        const parsedQuery = parseQuery(query);
        if (Object.keys(parsedQuery).length > 0) {
            setPreviewSettings(parsedQuery);
        }
    }, [query, setPreviewSettings]);

    return {
        accent_color: settings.accent_color,
        font: settings.font,
        header_background_color: settings.header_background_color,
        header_link_color: settings.header_link_color,
        show_date: settings.show_date,
        show_subtitle: settings.show_subtitle,
    };
}
