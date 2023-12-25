import type { Story } from '@prezly/sdk';

export type StoryWithImage = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

export interface BasePageProps {
    // biome-ignore lint/suspicious/noExplicitAny: The translations type is too complex to be defined here
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
    // biome-ignore lint/style/useNamingConvention: <explanation>
    accent_color: string;
    font: Font;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    header_background_color: string;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    header_link_color: string;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    show_date: boolean;
    // biome-ignore lint/style/useNamingConvention: <explanation>
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
