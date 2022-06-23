import { useNewsroomContext } from '@prezly/theme-kit-nextjs';
import { useSessionStorageValue } from '@react-hookz/web';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import type { ThemeSettings, ThemeSettingsApiResponse } from 'types';

import { DEFAULT_THEME_SETTINGS, STORAGE_KEY } from './constants';
import { parseQuery } from './utils';

export function useThemeSettings(): ThemeSettings {
    const { query } = useRouter();
    const { themePreset } = useNewsroomContext();
    const [previewSettings, setPreviewSettings] = useSessionStorageValue(STORAGE_KEY, {});

    const settings: ThemeSettingsApiResponse = {
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
        accentColor: settings.accent_color,
        font: settings.font,
        headerBackgroundColor: settings.header_background_color,
        headerLinkColor: settings.header_link_color,
        showDate: settings.show_date,
        showSubtitle: settings.show_subtitle,
    };
}
