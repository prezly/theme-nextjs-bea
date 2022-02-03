import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

import type { StoryWithImage } from 'types';

export function getStoryThumbnail(
    story: StoryWithImage | AlgoliaStory,
): UploadcareImageDetails | null {
    const { thumbnail_image } = story;

    if (thumbnail_image) {
        return JSON.parse(thumbnail_image);
    }

    return null;
}
