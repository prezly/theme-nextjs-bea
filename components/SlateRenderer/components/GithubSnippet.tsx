import React, { FunctionComponent, MouseEventHandler, useEffect, useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
//
// // @ts-ignore
// import js from "react-syntax-highlighter/src/languages/hljs/javascript";
// // @ts-ignore
// import ts from "react-syntax-highlighter/src/languages/hljs/typescript";
// // @ts-ignore
// import yaml from "react-syntax-highlighter/src/languages/hljs/yaml";
// // @ts-ignore
// import css from "react-syntax-highlighter/src/languages/hljs/css";
// // @ts-ignore
// import scss from "react-syntax-highlighter/src/languages/hljs/scss";
// // @ts-ignore
// import bash from "react-syntax-highlighter/src/languages/hljs/bash";
// // @ts-ignore
// import xml from "react-syntax-highlighter/src/languages/hljs/xml";
//
// SyntaxHighlighter.registerLanguage("javascript", js);
// SyntaxHighlighter.registerLanguage("typescript", ts);
// SyntaxHighlighter.registerLanguage("yaml", yaml);
// SyntaxHighlighter.registerLanguage("css", css);
// SyntaxHighlighter.registerLanguage("scss", scss);
// SyntaxHighlighter.registerLanguage("xml", xml);
// SyntaxHighlighter.registerLanguage("sh", bash);

const getLanguageByFileExtension = (extension: string) =>
    ({
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        yml: 'yaml',
    }[extension] || extension);

import styles from './GithubSnippet.module.scss';
import getGithubFileDetailsByUrl from '@/utils/getGithubFileDetailsByUrl';
import copyTextToClipboard from '@/utils/copyTextToClipboard';
import { useTheme } from 'next-themes';

interface Props {
    src: string;
    showLineNumbers?: boolean;
    showFileMeta?: boolean;
}

const GithubSnippet: FunctionComponent<Props> = ({
    src,
    showLineNumbers = true,
    showFileMeta = true,
}) => {
    const [canCopy, setCanCopy] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [fileContents, setFileContents] = useState<string>();
    const { fileExtension, filename, rawFileURL } = getGithubFileDetailsByUrl(src);
    const { theme } = useTheme();

    useEffect(() => {
        setCanCopy(Boolean(window.navigator?.clipboard));
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setFileContents(undefined);
        // @ts-ignore
        setError(null);
        fetch(rawFileURL)
            .then((response) => {
                setIsLoading(false);
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
            })
            .then(setFileContents)
            .catch((error: Error) => setError(error.message));
    }, [rawFileURL]);

    const copyToClipboard: MouseEventHandler = (event) => {
        event.preventDefault();
        copyTextToClipboard(fileContents);
    };

    const themeClassName = theme === 'light' ? styles.github : styles.githubDark;

    if (!fileContents) {
        return null;
    }

    return (
        <div className={[styles.wrapper, themeClassName].join(' ')}>
            {isLoading && (
                <svg
                    role="status"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-rose-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
            )}

            {error && <div className="p-4 bg-rose-600 text-white">{error}</div>}

            {fileContents && (
                <SyntaxHighlighter
                    showLineNumbers={showLineNumbers}
                    useInlineStyles={false}
                    language={getLanguageByFileExtension(fileExtension)}
                >
                    {fileContents}
                </SyntaxHighlighter>
            )}

            {showFileMeta && (
                <div className={styles.meta}>
                    <a className={styles.action} target="__blank" href={src}>
                        {filename}
                    </a>
                    <div>
                        {canCopy && fileContents && (
                            <a className={styles.action} onClick={copyToClipboard}>
                                Copy
                            </a>
                        )}
                        <a className={styles.action} target="__blank" href={src}>
                            View raw
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GithubSnippet;
