import { ExtraStoryFields, Story } from '@prezly/sdk';

export type StoryWithImage = Story & Pick<ExtraStoryFields, 'header_image'>;
