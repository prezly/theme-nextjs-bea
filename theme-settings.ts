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
    categories_layout: 'dropdown' | 'bar';
    font: Font;
    footer_background_color: string;
    footer_text_color: string;
    full_width_featured_story: boolean;
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
    show_read_more: boolean;
    show_download_pdf: boolean;
    show_download_assets: boolean;
    share_to_facebook: boolean;
    share_to_messenger: boolean;
    share_to_twitter: boolean;
    share_to_telegram: boolean;
    share_to_whatsapp: boolean;
    share_to_linkedin: boolean;
    share_to_pinterest: boolean;
    share_to_reddit: boolean;
    share_to_bluesky: boolean;
    share_via_url: boolean;
    share_via_copy: boolean;
    story_card_variant: 'default' | 'boxed';
    text_color: string;
}

export type SharingOptions = Pick<
    ThemeSettings,
    | 'share_to_facebook'
    | 'share_to_messenger'
    | 'share_to_twitter'
    | 'share_to_telegram'
    | 'share_to_whatsapp'
    | 'share_to_linkedin'
    | 'share_to_pinterest'
    | 'share_to_reddit'
    | 'share_to_bluesky'
    | 'share_via_url'
    | 'share_via_copy'
>;

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
    accent_color: '#3b82f6',
    background_color: '#ffffff',
    categories_layout: 'dropdown',
    font: Font.INTER,
    footer_background_color: '#111827',
    footer_text_color: '#ffffff',
    full_width_featured_story: false,
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
    show_read_more: true,
    show_download_pdf: true,
    show_download_assets: true,
    share_to_facebook: true,
    share_to_messenger: false,
    share_to_twitter: true,
    share_to_telegram: false,
    share_to_whatsapp: false,
    share_to_linkedin: true,
    share_to_pinterest: false,
    share_to_reddit: false,
    share_to_bluesky: false,
    share_via_url: true,
    share_via_copy: true,
    story_card_variant: 'default',
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
            return 'Mulish';
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
