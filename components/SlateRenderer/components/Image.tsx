import { STORY_IMAGE, useAnalytics } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { ImageNode } from '@prezly/slate-types';
import type { PropsWithChildren } from 'react';

interface Props {
    node: ImageNode;
}

function Image({ node, children }: PropsWithChildren<Props>) {
    const { track } = useAnalytics();

    return (
        <Elements.Image
            node={node}
            onDownload={(image) => {
                track(STORY_IMAGE.DOWNLOAD, { id: image.uuid });
            }}
            onPreviewOpen={(image) => {
                track(STORY_IMAGE.VIEW, { id: image.uuid });
            }}
        >
            {children}
        </Elements.Image>
    );
}

export default Image;
