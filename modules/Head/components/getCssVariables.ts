/* eslint-disable @typescript-eslint/naming-convention */
import tinycolor from 'tinycolor2';

import { Font, FONT_FAMILY, type ThemeSettings } from 'theme-settings';

import styles from './getCssVariables.module.scss';

const accentVariationFactors = {
    DARKEST: 18,
    DARKER: 12,
    DARK: 6,
    LIGHT: 6,
    LIGHTER: 12,
    LIGHTEST: 18,
};

function getFontFamily(font: Font): string {
    return FONT_FAMILY[font] || FONT_FAMILY[Font.INTER];
}

export function getCssVariables(settings: ThemeSettings, defaults: ThemeSettings) {
    const { accent_color, font, header_background_color, header_link_color } = settings;

    // Use the default placeholder color if the header background color has not been changed
    const placeholderBackgroundColor =
        defaults.header_background_color.toLowerCase() === header_background_color.toLowerCase()
            ? styles['default-placeholder-color']
            : header_background_color;

    const accentColorButtonText = tinycolor(accent_color).isLight()
        ? styles['dark-text-color']
        : styles['light-text-color'];

    return {
        '--prezly-font-family': getFontFamily(font),
        '--prezly-accent-color': accent_color,
        '--prezly-accent-color-light': tinycolor(accent_color)
            .lighten(accentVariationFactors.LIGHT)
            .toHexString(),
        '--prezly-accent-color-lighter': tinycolor(accent_color)
            .lighten(accentVariationFactors.LIGHTER)
            .toHexString(),
        '--prezly-accent-color-lightest': tinycolor(accent_color)
            .lighten(accentVariationFactors.LIGHTEST)
            .toHexString(),
        '--prezly-accent-color-dark': tinycolor(accent_color)
            .darken(accentVariationFactors.DARK)
            .toHexString(),
        '--prezly-accent-color-darker': tinycolor(accent_color)
            .darken(accentVariationFactors.DARKER)
            .toHexString(),
        '--prezly-accent-color-darkest': tinycolor(accent_color)
            .darken(accentVariationFactors.DARKEST)
            .toHexString(),
        '--prezly-accent-color-button-text': accentColorButtonText,
        '--prezly-header-background-color': header_background_color,
        '--prezly-header-link-color': header_link_color,
        '--prezly-header-link-hover-color':
            header_link_color === defaults.header_link_color ? '#1f2937' : header_link_color,
        '--prezly-placeholder-background-color': placeholderBackgroundColor,
    };
}
