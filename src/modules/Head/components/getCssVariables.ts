/* eslint-disable @typescript-eslint/naming-convention */
import tinycolor from 'tinycolor2';

import { Font, FONT_FAMILY, getRelatedFont, type ThemeSettings } from '@/theme-settings';

function getFontFamily(font: Font): string {
    return FONT_FAMILY[font] || FONT_FAMILY[Font.INTER];
}

function getSecondaryFontFamily(font: Font): string {
    switch (getRelatedFont(font)) {
        case Font.ALEGREYA_SANS:
            return FONT_FAMILY[Font.ALEGREYA_SANS];
        default:
            return getFontFamily(font);
    }
}

export function getCssVariables(settings: ThemeSettings): Record<string, string> {
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

    const placeholderBackgroundColor = tinycolor(header_background_color);

    const accentColorActive = tinycolor(accent_color).darken(10);
    const accentColorHover = tinycolor(accent_color).lighten(5);

    const accentColorButtonText = tinycolor(accent_color).isLight() ? '#000000' : '#ffffff';

    const backgroundColorSecondary = tinycolor(background_color).isLight()
        ? tinycolor(background_color).darken(2)
        : tinycolor(background_color).lighten(2);

    const backgroundColorTertiary = tinycolor(background_color).isLight()
        ? tinycolor(background_color).darken(5)
        : tinycolor(background_color).lighten(5);

    const textColorSecondary = tinycolor(text_color).setAlpha(0.8);
    const textColorTertiary = tinycolor(text_color).setAlpha(0.6);

    const borderColor = tinycolor(text_color).setAlpha(0.2);
    const borderColorSecondary = tinycolor(text_color).setAlpha(0.3);

    return {
        '--prezly-font-family': getFontFamily(font),
        '--prezly-font-family-secondary': getSecondaryFontFamily(font),
        '--prezly-border-color': borderColor.toHex8String(),
        '--prezly-border-color-secondary': borderColorSecondary.toHex8String(),
        '--prezly-text-color': text_color,
        '--prezly-text-color-secondary': textColorSecondary.toHex8String(),
        '--prezly-text-color-tertiary': textColorTertiary.toHex8String(),
        '--prezly-text-color-hover': text_color,
        '--prezly-background-color': background_color,
        '--prezly-background-color-secondary': backgroundColorSecondary.toHex8String(),
        '--prezly-background-color-tertiary': backgroundColorTertiary.toHex8String(),
        '--prezly-accent-color': accent_color,
        '--prezly-accent-color-active': accentColorActive.toHex8String(),
        '--prezly-accent-color-hover': accentColorHover.toHex8String(),
        '--prezly-accent-color-button-text': accentColorButtonText,
        '--prezly-header-background-color': header_background_color,
        '--prezly-header-link-color': header_link_color,
        '--prezly-header-link-hover-color': header_link_color,
        '--prezly-footer-background-color': footer_background_color,
        '--prezly-footer-text-color': footer_text_color,
        '--prezly-footer-text-color-variation': footer_text_color,
        '--prezly-placeholder-background-color': placeholderBackgroundColor.toHex8String(),
        '--prezly-white': '#ffffff',
        '--prezly-black': '#000000',
        '--prezly-grey': '#757575',
    };
}
