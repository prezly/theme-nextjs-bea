import type { Newsroom } from '@prezly/sdk';

import type { PublicListStory } from './utils';

export type ListStory = PublicListStory;

export type NewsroomWithHubLayout = Newsroom;

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
