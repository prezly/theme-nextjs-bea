import { Image as ImageRenderer, NodeRenderer } from '@prezly/content-renderer-react-js';
import { ImageNode, UploadcareImage } from '@prezly/slate-types';

import { STORY_IMAGE, useAnalytics } from '@/modules/analytics';

const Image: NodeRenderer<ImageNode> = ({ node, children }) => {
    const { track } = useAnalytics();

    return (
        <ImageRenderer
            node={node}
            onDownload={(image: UploadcareImage) => {
                track(STORY_IMAGE.DOWNLOAD, { id: image.uuid });
            }}
            onPreviewOpen={(image: UploadcareImage) => {
                track(STORY_IMAGE.VIEW, { id: image.uuid });
            }}
        >
            {children}
        </ImageRenderer>
    );
};

export default Image;
