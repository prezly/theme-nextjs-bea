import type { Story } from '@prezly/sdk';

export type ListStory = Story & Pick<Story.ExtraFields, 'thumbnail_image'> & { tags?: string[] };

export type SearchSettings = {
    searchBackend: 'meilisearch';
    host: string;
    apiKey: string;
    index: string;
};

export type ExternalNewsroomUrl =
    | false
    | {
          newsroomUrl: string;
      };

export type ExternalStoryUrl =
    | false
    | {
          newsroomUrl: string;
          storyUrl: string;
      };
