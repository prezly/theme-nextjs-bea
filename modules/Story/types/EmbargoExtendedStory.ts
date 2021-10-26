import { ExtendedStory } from '@prezly/sdk';

export type EmbargoExtendedStory = Omit<ExtendedStory, 'is_embargo' | 'published_at'> & {
    is_embargo: true;
    published_at: string;
};
