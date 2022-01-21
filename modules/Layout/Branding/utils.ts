import { NewsroomThemePreset } from '@prezly/sdk';
import tinycolor from 'tinycolor2';

import { FONT_FAMILY } from './constants';
import { Font, ThemeSettings } from './types';

import styles from './Branding.module.scss';

const ACCENT_COLOR_TINT_FACTOR = 10;
const ACCENT_COLOR_SHADE_FACTOR = 10;

export const getCssVariables = (themePreset: NewsroomThemePreset) => {
    const {
        accent_color: accentColor,
        font,
        header_background_color: headerBackgroundColor,
        header_link_color: headerLinkColor,
    } = themePreset.settings as ThemeSettings;

    const accentColorButtonText = tinycolor(accentColor).isLight()
        ? styles['dark-text-color']
        : styles['light-text-color'];

    return [
        `--prezly-font-family: ${FONT_FAMILY[font]}`,
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
    ];
};

export const getGoogleFontName = (font: Font): string => {
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
};
