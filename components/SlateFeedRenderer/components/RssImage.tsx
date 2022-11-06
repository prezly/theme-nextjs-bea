import { stringifyNode } from '@prezly/content-renderer-react-js';
import type { ImageNode } from '@prezly/story-content-format';
import { UploadcareImage } from '@prezly/uploadcare';
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

interface Props {
    node: ImageNode;
}

// @ts-ignore
export function RssImage({ node, children }: PropsWithChildren<Props>) {
    // @ts-ignore
    const { file, href } = node;
    const image = useMemo(() => UploadcareImage.createFromPrezlyStoragePayload(file), [file.uuid]);
    const imageWidth = 1200;
    const title = stringifyNode(node);

    if (href) {
        return (
            <a href={href}>
                <img src={image.resize(imageWidth).format().cdnUrl} alt={'Image'} />
                {title && <figcaption>{title}</figcaption>}
            </a>
        );
    }

    return (
        <>
            <img src={image.resize(imageWidth).format().cdnUrl} alt={'Image'} />
            {title && <figcaption>{title}</figcaption>}
        </>
    );
}
