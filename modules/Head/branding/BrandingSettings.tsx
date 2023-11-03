/* eslint-disable @typescript-eslint/no-use-before-define */

import type { ThemeSettings } from 'types';

import { Favicons } from '../Favicons';

import { DEFAULT_THEME_SETTINGS } from './defaults';
import { getGoogleFontName } from './fonts';
import { getCssVariables } from './getCssVariables';
import { InjectCssVariables } from './InjectCssVariables';

interface Props {
    faviconUrl: string | undefined;
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

function withoutUndefined<T extends Record<string, unknown>>(
    o: T,
): {
    [key in keyof T]: T[key] extends undefined ? never : T[key];
} {
    return Object.fromEntries(Object.entries(o).filter(([, value]) => value !== undefined)) as any;
}
