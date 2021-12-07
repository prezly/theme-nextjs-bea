import type { Story } from '@prezly/sdk';

export type EmbargoStory = Omit<Story, 'is_embargo' | 'published_at'> & {
    is_embargo: true;
    published_at: string;
};
