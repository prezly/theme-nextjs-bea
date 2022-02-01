import { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

import { StoryWithImage } from 'types';

export function getStoryThumbnail(
    story: StoryWithImage | AlgoliaStory,
): UploadcareImageDetails | null {
    const { thumbnail_image } = story;

    if (thumbnail_image) {
        return JSON.parse(thumbnail_image);
    }

    return null;
}
