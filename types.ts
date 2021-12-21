import type {
    Category,
    CultureRef,
    ExtraStoryFields,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
    Story,
} from '@prezly/sdk';

import type { AlgoliaSettings } from './utils/prezly';

export interface Env {
    NODE_ENV: 'production' | 'development' | 'test';
    PREZLY_ACCESS_TOKEN: string;
    PREZLY_NEWSROOM_UUID: string;
    ALGOLIA_APP_ID: string;
    ALGOLIA_INDEX: string;
    ALGOLIA_API_KEY: string;
    NEXT_PUBLIC_HCAPTCHA_SITEKEY: string;
}

export interface BasePageProps {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    languages: NewsroomLanguageSettings[];
    localeCode: string;
    /**
     * `false` means it's the default locale
     */
    shortestLocaleCode: string | false;
    localeResolved: boolean;
    themePreset: NewsroomThemePreset;
    algoliaSettings: AlgoliaSettings;
}

export interface PaginationProps {
    itemsTotal: number;
    currentPage: number;
    pageSize: number;
}

export type StoryWithImage = Story & Pick<ExtraStoryFields, 'header_image' | 'preview_image'>;

export type AlgoliaStory = Pick<Story, 'uuid' | 'slug' | 'title' | 'subtitle'> &
    Pick<ExtraStoryFields, 'header_image' | 'preview_image'> & {
        content_text: string;
        updated_at: number;
        published_at: number;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
    };

export type Translations = Record<string, string>;
