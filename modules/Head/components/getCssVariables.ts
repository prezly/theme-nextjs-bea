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

export function getCssVariables(
    settings: ThemeSettings,
    defaults: ThemeSettings,
): Record<string, string> {
    const {
        accent_color,
        background_color,
        font,
        footer_background_color,
        footer_text_color,
        header_background_color,
        header_link_color,
        text_color,
    } = settings;

    // Use the default placeholder color if the header background color has not been changed
    const placeholderBackgroundColor =
        defaults.header_background_color.toLowerCase() === header_background_color.toLowerCase()
            ? styles['default-placeholder-color']
            : header_background_color;

    const accentColorButtonText = tinycolor(accent_color).isLight()
        ? styles['dark-text-color']
        : styles['light-text-color'];

    const backgroundColorVariation = tinycolor(background_color).isLight()
        ? tinycolor(background_color).darken(accentVariationFactors.DARK)
        : tinycolor(background_color).lighten(accentVariationFactors.LIGHT);

    const textColorHover = tinycolor(text_color).darken(accentVariationFactors.DARK);
    const textColorMuted = tinycolor(text_color).isLight()
        ? tinycolor(text_color).darken(accentVariationFactors.DARKEST)
        : tinycolor(text_color).lighten(accentVariationFactors.LIGHTEST);

    const borderColor = tinycolor(text_color).isDark()
        ? tinycolor(text_color).lighten(60)
        : tinycolor(text_color).darken(60);

    const footerTextColorVariation = tinycolor(footer_text_color).isLight()
        ? tinycolor(footer_text_color).darken(accentVariationFactors.DARK)
        : tinycolor(footer_text_color).lighten(accentVariationFactors.LIGHT);

    return {
        '--prezly-font-family': getFontFamily(font),
        '--prezly-border-color': borderColor.toHexString(),
        '--prezly-text-color': text_color,
        '--prezly-text-color-hover': textColorHover.toHexString(),
        '--prezly-text-color-muted': textColorMuted.toHexString(),
        '--prezly-background-color': background_color,
        '--prezly-background-color-variation': backgroundColorVariation.toHexString(),
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
        '--prezly-footer-background-color': footer_background_color,
        '--prezly-footer-text-color': footer_text_color,
        '--prezly-footer-text-color-variation': footerTextColorVariation.toHexString(),
        '--prezly-placeholder-background-color': placeholderBackgroundColor,
    };
}
