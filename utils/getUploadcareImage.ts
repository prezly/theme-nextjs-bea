import type { UploadedImage } from '@prezly/uploadcare';
import { UploadcareImage } from '@prezly/uploadcare';

export function getUploadcareImage(payload: UploadedImage | null): UploadcareImage | null {
    if (payload === null) {
        return null;
    }

    return UploadcareImage.createFromPrezlyStoragePayload(payload);
}
