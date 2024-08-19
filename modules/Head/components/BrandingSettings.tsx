import { withoutUndefined } from '@/utils';
import { DEFAULT_THEME_SETTINGS, getGoogleFontName, type ThemeSettings } from 'theme-settings';

import { getCssVariables } from './getCssVariables';
import { InjectCssVariables } from './InjectCssVariables';

interface Props {
    settings: Partial<ThemeSettings>;
}

export function BrandingSettings({ settings }: Props) {
    const compiledSettings: ThemeSettings = {
        ...DEFAULT_THEME_SETTINGS,
        ...withoutUndefined(settings),
    };

    const googleFontName = getGoogleFontName(compiledSettings.font).replace(' ', '+');

    return (
        <>
            <link
                href={`https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;500;600;700;900&display=swap`}
                rel="stylesheet"
            />

            <InjectCssVariables variables={getCssVariables(compiledSettings)} />
        </>
    );
}
