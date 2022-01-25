export enum Font {
    INTER = 'inter',
    MERRIWEATHER = 'merriweather',
    OPEN_SANS = 'open_sans',
    PT_SERIF = 'pt_serif',
    ROBOTO = 'roboto',
    SOURCE_CODE_PRO = 'source_code_pro',
}

export interface ThemeSettings {
    accent_color: string;
    font: Font;
    header_background_color: string;
    header_link_color: string;
}
