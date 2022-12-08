import type { Story } from '@prezly/sdk';

export type StoryWithImage = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

export interface BasePageProps {
    translations: Record<string, any>;
    isTrackingEnabled?: boolean;
}

export enum Font {
    INTER = 'inter',
    MERRIWEATHER = 'merriweather',
    OPEN_SANS = 'open_sans',
    PT_SERIF = 'pt_serif',
    ROBOTO = 'roboto',
    SOURCE_CODE_PRO = 'source_code_pro',
}

export interface ThemeSettingsApiResponse {
    accent_color: string;
    font: Font;
    header_background_color: string;
    header_link_color: string;
    show_date: boolean;
    show_subtitle: boolean;
}

export interface ThemeSettings {
    accentColor: string;
    font: Font;
    headerBackgroundColor: string;
    headerLinkColor: string;
    showDate: boolean;
    showSubtitle: boolean;
}
