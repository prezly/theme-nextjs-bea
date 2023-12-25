import tinycolor from 'tinycolor2';

import { DEFAULT_THEME_SETTINGS } from '@/hooks';
import type { ThemeSettings } from 'types';
import { Font } from 'types';

import { FONT_FAMILY } from './constants';

import styles from './Branding.module.scss';

const accentVariationFactors = {
    darkest: 18,
    darker: 12,
    dark: 6,
    light: 6,
    lighter: 12,
    lightest: 18,
};

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
        `--prezly-accent-color-light: ${tinycolor(accentColor)
            .lighten(accentVariationFactors.light)
            .toHexString()}`,
        `--prezly-accent-color-lighter: ${tinycolor(accentColor)
            .lighten(accentVariationFactors.lighter)
            .toHexString()}`,
        `--prezly-accent-color-lightest: ${tinycolor(accentColor)
            .lighten(accentVariationFactors.lightest)
            .toHexString()}`,
        `--prezly-accent-color-dark: ${tinycolor(accentColor)
            .darken(accentVariationFactors.dark)
            .toHexString()}`,
        `--prezly-accent-color-darker: ${tinycolor(accentColor)
            .darken(accentVariationFactors.darker)
            .toHexString()}`,
        `--prezly-accent-color-darkest: ${tinycolor(accentColor)
            .darken(accentVariationFactors.darkest)
            .toHexString()}`,
        `--prezly-accent-color-button-text: ${accentColorButtonText}`,
        `--prezly-header-background-color: ${headerBackgroundColor}`,
        `--prezly-header-link-color: ${headerLinkColor}`,
        `--prezly-header-link-hover-color: ${
            headerLinkColor === DEFAULT_THEME_SETTINGS.header_link_color
                ? '#1f2937'
                : headerLinkColor
        }`,
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
