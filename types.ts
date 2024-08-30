import type { Story } from '@prezly/sdk';

export type ListStory = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

export type SearchSettings = {
    searchBackend: 'meilisearch';
    host: string;
    apiKey: string;
    index: string;
};
