import type { Newsroom, Story } from '@prezly/sdk';

export type ListStory = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

// `hub_layout` is a root Newsroom field (PATCHed via admin-api/v1/newsrooms/:id),
// but @prezly/sdk@26.5.0's Newsroom type predates it. Augment locally.
export type NewsroomWithHubLayout = Newsroom & {
    hub_layout?: 'tiles' | 'market_dropdown';
};

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
