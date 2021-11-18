import { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

import { StoryWithImage } from 'types';

export function getStoryThumbnail(story: StoryWithImage): UploadcareImageDetails | null {
    const { header_image, preview_image } = story;

    if (preview_image) {
        return JSON.parse(preview_image);
    }

    if (header_image) {
        return JSON.parse(header_image);
    }

    return null;
}
