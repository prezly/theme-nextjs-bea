import {
    DEFAULT_THEME_SETTINGS,
    getGoogleFontName,
    getRelatedFont,
    type ThemeSettings,
} from '@/theme-settings';
import { withoutUndefined } from '@/utils';

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

    const primaryGoogleFontName = getGoogleFontName(compiledSettings.font).replace(' ', '+');
    const relatedFont = getRelatedFont(compiledSettings.font);

    let families = [];
    if (relatedFont) {
        const relatedGoogleFontName = getGoogleFontName(relatedFont).replace(' ', '+');

        families = [
            `${primaryGoogleFontName}:wght@600`,
            `${relatedGoogleFontName}:wght@400;500;600;700;900`,
        ];
    } else {
        families = [`${primaryGoogleFontName}:wght@400;500;600;700;900`];
    }

    return (
        <>
            <link
                href={`https://fonts.googleapis.com/css2?display=swap&${families
                    .map((family) => `family=${family}`)
                    .join('&')}`}
                rel="stylesheet"
            />

            <InjectCssVariables variables={getCssVariables(compiledSettings)} />
        </>
    );
}
