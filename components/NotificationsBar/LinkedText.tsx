import type { ReactElement } from 'react';

interface Props {
    links: Link[];
    children: string;
}

interface Link {
    name: string;
    target: string;
}

/**
 * Replace text marked with "[...]" with the anchor elements.
 *
 * Example:
 *
 *   description: "Visit [our website] to start using the most awesome PR software"
 *   actions:     { name: "our website", target: "https://www.prezly.com/" }
 *
 * Result:
 *
 *   Visit <a href="https://www.prezly.com/">our website</a> to start using the most awesome PR software.
 *
 */
export function LinkedText({ children: text, links }: Props) {
    let parts: (ReactElement | string)[] = [text];

    links.forEach(({ target, name }) => {
        parts = parts.flatMap((part) => {
            const replace = `[${name}]`;
            if (typeof part !== 'string' || !part.includes(replace)) {
                return part;
            }
            return part.split(replace).flatMap((value, index) => {
                if (index === 0) return [value];
                return [
                    <a
                        key={`${target}:${name}`}
                        href={target}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {name}
                    </a>,
                    value,
                ];
            });
        });
    });

    return <>{parts}</>;
}
