import tinycolor from 'tinycolor2';

import { DEFAULT_THEME_SETTINGS } from '@/hooks';
import type { ThemeSettings } from 'types';
import { Font } from 'types';

import { FONT_FAMILY } from './constants';

import styles from './Branding.module.scss';

const ACCENT_COLOR_TINT_FACTOR = 10;
const ACCENT_COLOR_SHADE_FACTOR = 10;

function getFontFamily(font: Font): string {
    return FONT_FAMILY[font] || Font.INTER;
}

export function getCssVariables(themeSettings: ThemeSettings) {
    const { accentColor, font, headerBackgroundColor, headerLinkColor } = themeSettings;

    // Use the default placeholder color if the header background color has not been changed
    const placeholderBackgroundColor =
        DEFAULT_THEME_SETTINGS.header_background_color.toLowerCase() ===
        headerBackgroundColor.toLowerCase()
            ? styles['default-placeholder-color']
            : headerBackgroundColor;

    const accentColorButtonText = tinycolor(accentColor).isLight()
        ? styles['dark-text-color']
        : styles['light-text-color'];

    return [
        `--prezly-font-family: ${getFontFamily(font)}`,
        `--prezly-accent-color: ${accentColor}`,
        `--prezly-accent-color-tint: ${tinycolor(accentColor)
            .lighten(ACCENT_COLOR_TINT_FACTOR)
            .toHexString()}`,
        `--prezly-accent-color-shade: ${tinycolor(accentColor)
            .darken(ACCENT_COLOR_SHADE_FACTOR)
            .toHexString()}`,
        `--prezly-accent-color-button-text: ${accentColorButtonText}`,
        `--prezly-header-background-color: ${headerBackgroundColor}`,
        `--prezly-header-link-color: ${headerLinkColor}`,
        `--prezly-placeholder-background-color: ${placeholderBackgroundColor}`,
    ];
}

export function getGoogleFontName(font: Font): string {
    switch (font) {
        case Font.MERRIWEATHER:
            return 'Merriweather';
        case Font.OPEN_SANS:
            return 'Open+Sans';
        case Font.PT_SERIF:
            return 'PT+Serif';
        case Font.ROBOTO:
            return 'Roboto';
        case Font.SOURCE_CODE_PRO:
            return 'Source+Code+Pro';
        default:
            return 'Inter';
    }
}
