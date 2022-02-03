import { Image as ImageRenderer } from '@prezly/content-renderer-react-js';
import type { ImageNode, UploadcareImage } from '@prezly/slate-types';
import type { PropsWithChildren } from 'react';

import { STORY_IMAGE, useAnalytics } from '@/modules/analytics';

interface Props {
    node: ImageNode;
}

function Image({ node, children }: PropsWithChildren<Props>) {
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
}

export default Image;
