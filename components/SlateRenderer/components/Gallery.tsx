import { Gallery as GalleryRenderer, NodeRenderer } from '@prezly/content-renderer-react-js';
import { GalleryNode, UploadcareImage } from '@prezly/slate-types';

import { STORY_GALLERY_IMAGE, useAnalytics } from '@/modules/analytics';

const Gallery: NodeRenderer<GalleryNode> = ({ node }) => {
    const { track } = useAnalytics();

    return (
        <GalleryRenderer
            node={node}
            onImageDownload={(image: UploadcareImage) => {
                track(STORY_GALLERY_IMAGE.DOWNLOAD, { id: image.uuid });
            }}
            onPreviewOpen={(image: UploadcareImage) => {
                track(STORY_GALLERY_IMAGE.VIEW, { id: image.uuid });
            }}
        />
    );
};

export default Gallery;
