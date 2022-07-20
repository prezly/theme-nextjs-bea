import type { QuoteNode } from '@prezly/story-content-format';
import type { PropsWithChildren } from 'react';

interface Props {
    node: QuoteNode;
}

export function Quote({ children }: PropsWithChildren<Props>) {
    return (
        <blockquote>
            <div>{children}</div>
        </blockquote>
    );
}
