import type { ExtraStoryFields, Story } from '@prezly/sdk';

export interface PaginationProps {
    itemsTotal: number;
    currentPage: number;
    pageSize: number;
}

export type StoryWithImage = Story & Pick<ExtraStoryFields, 'thumbnail_image'>;

export type AlternateLanguageLink = {
    href: string;
    hrefLang: string;
};

export interface BasePageProps {
    translations: Record<string, any>;
    isTrackingEnabled?: boolean;
}
