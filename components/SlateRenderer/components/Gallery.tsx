import { STORY_GALLERY_IMAGE, useAnalytics } from '@prezly/analytics-nextjs';
import { Gallery as GalleryRenderer } from '@prezly/content-renderer-react-js';
import type { GalleryNode } from '@prezly/slate-types';

interface Props {
    node: GalleryNode;
}

function Gallery({ node }: Props) {
    const { track } = useAnalytics();

    return (
        <GalleryRenderer
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
