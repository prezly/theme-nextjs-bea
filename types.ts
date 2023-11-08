import type { Story } from '@prezly/sdk';

export type StoryWithImage = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

export interface BasePageProps {
    translations: Record<string, any>;
    isTrackingEnabled?: boolean;
}
