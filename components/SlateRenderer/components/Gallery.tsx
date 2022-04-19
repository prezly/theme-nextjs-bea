import { STORY_GALLERY_IMAGE, useAnalytics } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { GalleryNode } from '@prezly/slate-types';

interface Props {
    node: GalleryNode;
}

function Gallery({ node }: Props) {
    const { track } = useAnalytics();

    return (
        <Elements.Gallery
            node={node}
            onImageDownload={(image) => {
                track(STORY_GALLERY_IMAGE.DOWNLOAD, { id: image.uuid });
            }}
            onPreviewOpen={(image) => {
                track(STORY_GALLERY_IMAGE.VIEW, { id: image.uuid });
            }}
        />
    );
}

export default Gallery;
