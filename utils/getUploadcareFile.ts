import type { UploadedFile } from '@prezly/uploadcare';
import { UploadcareFile } from '@prezly/uploadcare';

export function getUploadcareFile(payload: UploadedFile | null): UploadcareFile | null {
    if (payload === null) {
        return null;
    }

    return UploadcareFile.createFromPrezlyStoragePayload(payload);
}
