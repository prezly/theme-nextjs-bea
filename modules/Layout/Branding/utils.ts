import { NewsroomThemePreset } from '@prezly/sdk';
import tinycolor from 'tinycolor2';

const ACCENT_COLOR = '#2563eb';
const ACCENT_COLOR_TINT_FACTOR = 15;
const ACCENT_COLOR_SHADE_FACTOR = 20;

export const getCssVariables = (themePreset: NewsroomThemePreset) => {
    // TODO: Get values from themePreset when API returns them correctly
    const { editable_settings } = themePreset;

    return [
        `--prezly-accent-color: ${ACCENT_COLOR}`,
        `--prezly-accent-color-tint: ${tinycolor(ACCENT_COLOR)
            .lighten(ACCENT_COLOR_TINT_FACTOR)
            .toHexString()}`,
        `--prezly-accent-color-shade: ${tinycolor(ACCENT_COLOR)
            .darken(ACCENT_COLOR_SHADE_FACTOR)
            .toHexString()}`,
    ];
};
