export enum Font {
    ALEGREYA = 'alegreya',
    ALEGREYA_SANS = 'alegreya_sans',
    INTER = 'inter',
    MERRIWEATHER = 'merriweather',
    MULISH = 'mulish',
    NUNITO = 'nunito',
    OPEN_SANS = 'open_sans',
    PLAYFAIR_DISPLAY = 'playfair_display',
    PT_SERIF = 'pt_serif',
    ROBOTO = 'roboto',
    SOURCE_CODE_PRO = 'source_code_pro',
}

export interface ThemeSettings {
    accent_color: string;
    background_color: string;
    font: Font;
    footer_background_color: string;
    footer_text_color: string;
    header_background_color: string;
    header_image_placement: 'above' | 'below';
    header_link_color: string;
    layout: 'grid' | 'masonry';
    logo_size: string;
    main_logo: string | null;
    main_site_url: string | null;
    show_date: boolean;
    show_featured_categories: boolean;
    show_sharing_icons: boolean;
    show_subtitle: boolean;
    text_color: string;
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
    accent_color: '#3b82f6',
    background_color: '#ffffff',
    font: Font.INTER,
    footer_background_color: '#111827',
    footer_text_color: '#ffffff',
    header_background_color: '#ffffff',
    header_image_placement: 'below',
    header_link_color: '#4b5563',
    layout: 'grid',
    logo_size: 'medium',
    main_logo: null,
    main_site_url: null,
    show_date: true,
    show_featured_categories: true,
    show_sharing_icons: true,
    show_subtitle: false,
    text_color: '#374151',
};

export const FONT_FAMILY = {
    [Font.ALEGREYA]: "'Alegreya', serif",
    [Font.ALEGREYA_SANS]: "'Alegreya Sans', sans-serif",
    [Font.INTER]: 'Inter, sans-serif',
    [Font.MERRIWEATHER]: 'Merriweather, serif',
    [Font.MULISH]: 'Mulish, sans-serif',
    [Font.NUNITO]: "'Nunito', sans-serif",
    [Font.OPEN_SANS]: "'Open Sans', sans-serif",
    [Font.PLAYFAIR_DISPLAY]: "'Playfair Display', serif",
    [Font.PT_SERIF]: "'PT Serif', serif",
    [Font.ROBOTO]: 'Roboto, sans-serif',
    [Font.SOURCE_CODE_PRO]: "'Source Code Pro', monospace",
};

export function getRelatedFont(font: Font): Font | null {
    switch (font) {
        case Font.ALEGREYA:
        case Font.PLAYFAIR_DISPLAY:
            return Font.ALEGREYA_SANS;
        default:
            return null;
    }
}

export function getGoogleFontName(font: Font): string {
    switch (font) {
        case Font.ALEGREYA:
            return 'Alegreya';
        case Font.ALEGREYA_SANS:
            return 'Alegreya Sans';
        case Font.MERRIWEATHER:
            return 'Merriweather';
        case Font.MULISH:
            return 'Mullish';
        case Font.NUNITO:
            return 'Nunito';
        case Font.OPEN_SANS:
            return 'Open Sans';
        case Font.PLAYFAIR_DISPLAY:
            return 'Playfair Display';
        case Font.PT_SERIF:
            return 'PT Serif';
        case Font.ROBOTO:
            return 'Roboto';
        case Font.SOURCE_CODE_PRO:
            return 'Source Code Pro';
        default:
            return 'Inter';
    }
}
