import {
    DEFAULT_THEME_SETTINGS,
    Font,
    getGoogleFontName,
    getRelatedFont,
    normalizeCustomFontDefinition,
    type CustomFont,
    type CustomFontDefinition,
    type FontVariant,
    type ThemeSettings,
} from '@/theme-settings';
import { withoutUndefined } from '@/utils';

import { getCssVariables } from './getCssVariables';
import { InjectCssVariables } from './InjectCssVariables';

interface Props {
    settings: Partial<ThemeSettings>;
}

function getGoogleFontsUrl(families: string[]): string {
    return `https://fonts.googleapis.com/css2?display=swap&${families
        .map((family) => `family=${family}`)
        .join('&')}`;
}

function getFontFaceStyle(definition: CustomFontDefinition): string {
    return `@font-face { font-family: '${definition.family}'; src: url('${definition.url}'); font-display: swap; }`;
}

function getFontFaceStyleFromVariant(family: string, variant: FontVariant): string {
    return `@font-face { font-family: '${family}'; src: url('${variant.src}'); font-weight: ${variant.weight}; font-style: ${variant.style}; font-display: swap; }`;
}

function collectCustomFontSlot(
    slot: CustomFontDefinition,
    weights: string,
    googleFamilies: string[],
    cssLinkUrls: string[],
    fontFaceStyles: string[],
) {
    const normalized = normalizeCustomFontDefinition(slot);

    switch (normalized.source) {
        case 'google':
            googleFamilies.push(`${normalized.family.replace(/ /g, '+')}:wght@${weights}`);
            break;
        case 'typekit':
            if (normalized.url) {
                cssLinkUrls.push(normalized.url);
            }
            break;
        case 'upload':
            if (normalized.variants?.length) {
                for (const v of normalized.variants) {
                    fontFaceStyles.push(getFontFaceStyleFromVariant(normalized.family, v));
                }
            } else if (normalized.url) {
                fontFaceStyles.push(getFontFaceStyle(normalized));
            }
            break;
        case 'link':
            if (normalized.variants?.length) {
                for (const v of normalized.variants) {
                    fontFaceStyles.push(getFontFaceStyleFromVariant(normalized.family, v));
                }
            } else if (normalized.url) {
                fontFaceStyles.push(getFontFaceStyle(normalized));
            }
            break;
    }
}

function renderCustomFontElements(customFont: CustomFont) {
    const googleFamilies: string[] = [];
    const cssLinkUrls: string[] = [];
    const fontFaceStyles: string[] = [];

    collectCustomFontSlot(customFont.heading, '400;600;700', googleFamilies, cssLinkUrls, fontFaceStyles);
    collectCustomFontSlot(customFont.paragraph, '400;500;600;700;900', googleFamilies, cssLinkUrls, fontFaceStyles);

    return (
        <>
            {googleFamilies.length > 0 && (
                <link href={getGoogleFontsUrl(googleFamilies)} rel="stylesheet" />
            )}
            {cssLinkUrls.map((url) => (
                <link key={url} href={url} rel="stylesheet" />
            ))}
            {fontFaceStyles.length > 0 && (
                <style dangerouslySetInnerHTML={{ __html: fontFaceStyles.join('\n') }} />
            )}
        </>
    );
}

function renderPresetFontElements(font: Font) {
    const primaryGoogleFontName = getGoogleFontName(font).replace(' ', '+');
    const relatedFont = getRelatedFont(font);

    let families = [];
    if (relatedFont) {
        const relatedGoogleFontName = getGoogleFontName(relatedFont).replace(' ', '+');

        families = [
            `${primaryGoogleFontName}:wght@600`,
            `${relatedGoogleFontName}:wght@400;500;600;700;900`,
        ];
    } else {
        families = [`${primaryGoogleFontName}:wght@400;500;600;700;900`];
    }

    return <link href={getGoogleFontsUrl(families)} rel="stylesheet" />;
}

export function BrandingSettings({ settings }: Props) {
    const compiledSettings: ThemeSettings = {
        ...DEFAULT_THEME_SETTINGS,
        ...withoutUndefined(settings),
    };

    const { font, custom_font } = compiledSettings;
    const isCustomFont = font === Font.CUSTOM && custom_font !== null;

    return (
        <>
            {isCustomFont
                ? renderCustomFontElements(custom_font)
                : renderPresetFontElements(font)}

            <InjectCssVariables variables={getCssVariables(compiledSettings)} />
        </>
    );
}
