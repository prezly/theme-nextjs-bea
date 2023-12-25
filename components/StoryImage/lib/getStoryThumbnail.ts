import type { AlgoliaStory } from '@prezly/theme-kit-core';
import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

import type { StoryWithImage } from 'types';

export function getStoryThumbnail(
    story: StoryWithImage | AlgoliaStory,
): UploadcareImageDetails | null {
    const { thumbnail_image: thumbnailImage } = story;

    if (thumbnailImage) {
        return JSON.parse(thumbnailImage);
    }

    return null;
}
