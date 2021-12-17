import { NewsroomThemePreset } from '@prezly/sdk';
import tinycolor from 'tinycolor2';

const LIGHT_TEXT_COLOR = '#ffffff';
const DARK_TEXT_COLOR = '#374151';
const ACCENT_COLOR = '#3b82f6';
const ACCENT_COLOR_TINT_FACTOR = 10;
const ACCENT_COLOR_SHADE_FACTOR = 10;

export const getCssVariables = (
    _themePreset: NewsroomThemePreset,
    accentColor: string = ACCENT_COLOR,
) => {
    // TODO: Get values from themePreset when API returns them correctly
    const accentColorButtonText = tinycolor(accentColor).isLight()
        ? DARK_TEXT_COLOR
        : LIGHT_TEXT_COLOR;

    return [
        `--prezly-accent-color: ${accentColor}`,
        `--prezly-accent-color-tint: ${tinycolor(accentColor)
            .lighten(ACCENT_COLOR_TINT_FACTOR)
            .toHexString()}`,
        `--prezly-accent-color-shade: ${tinycolor(accentColor)
            .darken(ACCENT_COLOR_SHADE_FACTOR)
            .toHexString()}`,
        `--prezly-accent-color-button-text: ${accentColorButtonText}`,
    ];
};
