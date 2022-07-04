import { Alignment } from '@prezly/story-content-format';
import type { ParagraphNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './OverwrittenParagraph.module.scss';
import GithubSnippet from "@/components/SlateRenderer/components/GithubSnippet";

interface Props {
    node: ParagraphNode;
    children?: ReactNode;
}

const isGitHubSnippet = (node: ParagraphNode) => {
    // @ts-ignore
    if (node && node.children[0].text) {
        // @ts-ignore
        const text = node.children[0].text as string;
        if (text.substring(0, 19) === 'https://github.com/') {
            return true;
        }
    }
    return false;
}

export function OverwrittenParagraph({ node, children }: Props) {
    if (isGitHubSnippet(node)) {
        // @ts-ignore
        return <GithubSnippet src={node.children[0].text as string} />;
    }

    return (
        <p
            className={classNames(styles.paragraph, {
                [styles.alignLeft]: node.align === Alignment.LEFT,
                [styles.alignCenter]: node.align === Alignment.CENTER,
                [styles.alignRight]: node.align === Alignment.RIGHT,
            })}
        >
            {children}
        </p>
    );
}
