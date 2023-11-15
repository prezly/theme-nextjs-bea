import type { Story } from '@prezly/sdk';

export type ListStory = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

export type AlgoliaSettings = {
    appId: string;
    apiKey: string;
    index: string;
};
