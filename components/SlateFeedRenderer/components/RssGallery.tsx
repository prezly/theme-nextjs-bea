import type { GalleryNode } from '@prezly/story-content-format';
import { UploadcareImage } from '@prezly/uploadcare';
import { useMemo } from 'react';

interface Props {
    node: GalleryNode;
}

function extractImages(node: GalleryNode): UploadcareImage[] {
    return node.images.map(({ caption, file }) =>
        UploadcareImage.createFromPrezlyStoragePayload(file, caption),
    );
}

export function RssGallery({ node }: Props) {
    const imageWidth = 1200;
    const originalImages = useMemo(() => extractImages(node), [node]);

    return (
        <>
            {originalImages.map((image, index) => (
                <img src={image.resize(imageWidth).format().cdnUrl} alt={'Image'} key={index} />
            ))}
        </>
    );
}
