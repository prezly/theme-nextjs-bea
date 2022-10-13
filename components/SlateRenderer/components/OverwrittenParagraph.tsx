import { Alignment } from '@prezly/story-content-format';
import type { ParagraphNode } from '@prezly/story-content-format';
import classNames from 'clsx';
import type { ReactNode } from 'react';

import GithubSnippet from '@/components/SlateRenderer/components/GithubSnippet';

import styles from './OverwrittenParagraph.module.scss';

interface Props {
    node: ParagraphNode;
    children?: ReactNode;
}

function isInfoBox(node: ParagraphNode) {
    // @ts-ignore
    if (node && node.children[0].text) {
        // @ts-ignore
        const text = node.children[0].text as string;
        if (text.substring(0, 1) === 'ℹ' || text.substring(0, 1) === '💡') {
            return true;
        }
    }
    return false;
}

function isGitHubSnippet(node: ParagraphNode) {
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

    if (isInfoBox(node)) {
        return (
            <div className="px-4 py-2 text-white bg-slate-700">
                <p
                    className={classNames(styles.paragraph, {
                        [styles.alignLeft]: node.align === Alignment.LEFT,
                        [styles.alignCenter]: node.align === Alignment.CENTER,
                        [styles.alignRight]: node.align === Alignment.RIGHT,
                    })}
                >
                    {children}
                </p>
            </div>
        );
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
