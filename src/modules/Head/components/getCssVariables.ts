import tinycolor from 'tinycolor2';

import {
    Font,
    FONT_FAMILY,
    getRelatedFont,
    type CustomFont,
    type ThemeSettings,
} from '@/theme-settings';

/**
 * Neumann brand tokens.
 *
 * These hardcoded values override anything coming from the Prezly API's live
 * `themeSettings` so the customized Neumann look is guaranteed regardless of
 * what an admin configures in Prezly's UI. Source of truth for visual parity:
 * https://newsroom.neumann.com/
 */
const NEUMANN_BRAND = {
    accentColor: '#ef7b0b',
    accentColorActive: '#ef7b0a', // slightly darker variant from live CSS
    accentColorHover: '#f18823', // lighter "button hover" variant from live CSS
    backgroundColor: '#000000', // page background
    backgroundColorSecondary: '#2d2d2d', // card / dropdown background
    backgroundColorIntermediate: '#1c1c1c', // mobile drawer / mid layer
    backgroundColorTertiary: '#141414', // CTA button background
    textColor: '#c1c1c1', // body text
    textColorSecondary: '#cccccc', // dates, secondary labels
    textColorTertiary: '#a7a7a7', // tertiary / disabled
    textColorStrong: '#ffffff', // headings, strong emphasis
    headerBackground: '#000000',
    headerLinkColor: '#c1c1c1',
    headerLinkHoverColor: '#ef7b0b',
    footerBackground: '#000000',
    footerTextColor: '#ffffff',
    borderColor: 'rgba(193, 193, 193, 0.2)',
    borderColorSecondary: 'rgba(193, 193, 193, 0.3)',
    fontFamily: FONT_FAMILY[Font.FF_UNIT_PRO],
};

function getFontFamily(font: Font, customFont: CustomFont | null): string {
    if (font === Font.CUSTOM) {
        if (customFont) {
            return `'${customFont.heading.family}', sans-serif`;
        }
        return FONT_FAMILY[Font.INTER];
    }
    return FONT_FAMILY[font] || FONT_FAMILY[Font.INTER];
}

function getParagraphFontFamily(font: Font, customFont: CustomFont | null): string {
    if (font === Font.CUSTOM) {
        if (customFont) {
            return `'${customFont.paragraph.family}', sans-serif`;
        }
        return FONT_FAMILY[Font.INTER];
    }
    switch (getRelatedFont(font)) {
        case Font.ALEGREYA_SANS:
            return FONT_FAMILY[Font.ALEGREYA_SANS];
        default:
            return getFontFamily(font, customFont);
    }
}

export function getCssVariables(settings: ThemeSettings): Record<string, string> {
    const { custom_font, font } = settings;

    // Start from the Neumann brand palette. Live API settings cannot override
    // these — they are part of the theme's identity, not user-configurable.
    const accent_color = NEUMANN_BRAND.accentColor;
    const background_color = NEUMANN_BRAND.backgroundColor;
    const text_color = NEUMANN_BRAND.textColor;
    const header_background_color = NEUMANN_BRAND.headerBackground;
    const header_link_color = NEUMANN_BRAND.headerLinkColor;
    const footer_background_color = NEUMANN_BRAND.footerBackground;
    const footer_text_color = NEUMANN_BRAND.footerTextColor;

    const placeholderBackgroundColor = tinycolor(header_background_color);

    // Auto-derived button text color — stays correct if the accent ever
    // changes. For Neumann's orange this resolves to white.
    const accentColorButtonText = tinycolor(accent_color).isLight() ? '#000000' : '#ffffff';

    const fontFamily =
        font === Font.FF_UNIT_PRO ? NEUMANN_BRAND.fontFamily : getFontFamily(font, custom_font);
    const fontFamilySecondary =
        font === Font.FF_UNIT_PRO
            ? NEUMANN_BRAND.fontFamily
            : getParagraphFontFamily(font, custom_font);

    const fontVariables: Record<string, string> = {
        '--prezly-font-family': fontFamily,
        '--prezly-font-family-secondary': fontFamilySecondary,
    };

    if (font === Font.CUSTOM && custom_font) {
        fontVariables['--prezly-font-family-paragraph'] =
            `'${custom_font.paragraph.family}', sans-serif`;
    }

    return {
        ...fontVariables,
        '--prezly-border-color': NEUMANN_BRAND.borderColor,
        '--prezly-border-color-secondary': NEUMANN_BRAND.borderColorSecondary,
        '--prezly-text-color': text_color,
        '--prezly-text-color-secondary': NEUMANN_BRAND.textColorSecondary,
        '--prezly-text-color-tertiary': NEUMANN_BRAND.textColorTertiary,
        '--prezly-text-color-hover': NEUMANN_BRAND.textColorStrong,
        '--prezly-background-color': background_color,
        '--prezly-background-color-secondary': NEUMANN_BRAND.backgroundColorSecondary,
        '--prezly-background-color-intermediate': NEUMANN_BRAND.backgroundColorIntermediate,
        '--prezly-background-color-tertiary': NEUMANN_BRAND.backgroundColorTertiary,
        '--prezly-accent-color': accent_color,
        '--prezly-accent-color-active': NEUMANN_BRAND.accentColorActive,
        '--prezly-accent-color-hover': NEUMANN_BRAND.accentColorHover,
        '--prezly-accent-color-button-text': accentColorButtonText,
        '--prezly-header-background-color': header_background_color,
        '--prezly-header-link-color': header_link_color,
        '--prezly-header-link-hover-color': NEUMANN_BRAND.headerLinkHoverColor,
        '--prezly-footer-background-color': footer_background_color,
        '--prezly-footer-text-color': footer_text_color,
        '--prezly-footer-text-color-variation': footer_text_color,
        '--prezly-placeholder-background-color': placeholderBackgroundColor.toHex8String(),
        '--prezly-white': '#ffffff',
        '--prezly-black': '#000000',
        '--prezly-grey': '#757575',
        // Neumann-specific tokens for components that need them directly.
        '--neumann-text-strong': NEUMANN_BRAND.textColorStrong,
    };
}
