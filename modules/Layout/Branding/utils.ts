import { NewsroomThemePreset } from '@prezly/sdk';
import tinycolor from 'tinycolor2';

const LIGHT_TEXT_COLOR = '#ffffff';
const DARK_TEXT_COLOR = '#374151';
const ACCENT_COLOR = '#2563eb';
const ACCENT_COLOR_TINT_FACTOR = 15;
const ACCENT_COLOR_SHADE_FACTOR = 20;

export const getCssVariables = (_themePreset: NewsroomThemePreset) => {
    // TODO: Get values from themePreset when API returns them correctly
    const accentColorButtonText = tinycolor(ACCENT_COLOR).isLight()
        ? DARK_TEXT_COLOR
        : LIGHT_TEXT_COLOR;

    return [
        `--prezly-accent-color: ${ACCENT_COLOR}`,
        `--prezly-accent-color-tint: ${tinycolor(ACCENT_COLOR)
            .lighten(ACCENT_COLOR_TINT_FACTOR)
            .toHexString()}`,
        `--prezly-accent-color-shade: ${tinycolor(ACCENT_COLOR)
            .darken(ACCENT_COLOR_SHADE_FACTOR)
            .toHexString()}`,
        `--prezly-accent-color-button-text: ${accentColorButtonText}`,
    ];
};
