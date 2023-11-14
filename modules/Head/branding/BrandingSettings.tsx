/* eslint-disable @typescript-eslint/no-use-before-define */

import { withoutUndefined } from '@/utils';
import { DEFAULT_THEME_SETTINGS, getGoogleFontName, type ThemeSettings } from 'theme-settings';

import { Favicons } from '../Favicons';

import { getCssVariables } from './getCssVariables';
import { InjectCssVariables } from './InjectCssVariables';

interface Props {
    faviconUrl?: string;
    settings: Partial<ThemeSettings>;
}

export function BrandingSettings({ faviconUrl, settings }: Props) {
    const compiledSettings: ThemeSettings = {
        ...DEFAULT_THEME_SETTINGS,
        ...withoutUndefined(settings),
    };

    const googleFontName = getGoogleFontName(compiledSettings.font).replace(' ', '+');

    return (
        <>
            <link
                href={`https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;500;600;900&display=swap`}
                rel="stylesheet"
            />

            <InjectCssVariables
                variables={getCssVariables(compiledSettings, DEFAULT_THEME_SETTINGS)}
            />

            <Favicons
                faviconUrl={faviconUrl}
                headerBackgroundColor={compiledSettings.header_background_color}
            />
        </>
    );
}
