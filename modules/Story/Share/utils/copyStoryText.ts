const DEFAULT_ARTICLE_SELECTOR = 'article';

import { htmlToText } from './htmlToText';

type TagName = string;
type Attribute = string;
const ELEMENTS_ATTRIBUTES_WHITELIST: Record<TagName, Attribute[]> = {
    A: ['href', 'target'],
};

export async function copyStoryText(articleElementSelector = DEFAULT_ARTICLE_SELECTOR) {
    const element = document.querySelector<HTMLElement>(articleElementSelector);

    if (!element) {
        return;
    }

    try {
        const text = await getArticleText(element).catch(() => element.innerText);
        const html = getArticleHtml(element);

        if (!text && !html) {
            return;
        }

        const textBlob = text && new Blob([text], { type: 'text/plain' });
        const htmlBlob = html && new Blob([html], { type: 'text/html' });

        const data = [
            new ClipboardItem({
                ...(textBlob ? { 'text/plain': textBlob } : {}),
                ...(htmlBlob ? { 'text/html': htmlBlob } : {}),
            }),
        ];

        await navigator.clipboard.write(data);
    } catch {
        const text = element.innerText;
        if (text) {
            await navigator.clipboard.writeText(text);
        }
    }
}

async function getArticleText(element: HTMLElement): Promise<string> {
    const clonedElement = element.cloneNode(true) as HTMLElement;

    clonedElement.querySelectorAll('table').forEach((node) => {
        node.outerHTML = `<div>${htmlTableToPlainText(node)}</div>`;
    });

    return htmlToText(clonedElement.innerHTML);
}

function getArticleHtml(element: HTMLElement): string {
    const clonedElement = element.cloneNode(true) as HTMLElement;

    clonedElement.querySelectorAll(':empty').forEach((child) => child.remove());

    clonedElement.querySelectorAll('*').forEach((child) => {
        const whitelist: string[] = ELEMENTS_ATTRIBUTES_WHITELIST[child.nodeName] ?? [];

        Array.from(child.attributes).forEach((attribute) => {
            if (whitelist.includes(attribute.name)) {
                return;
            }

            child.removeAttribute(attribute.name);
        });
    });

    return clonedElement.innerHTML;
}

function htmlTableToPlainText(tableElement: HTMLTableElement): string {
    const rows = Array.from(tableElement.rows);

    const columnWidths: number[] = rows.reduce<number[]>((result, row) => {
        return Array.from(row.cells, (cell, index) => {
            return Math.max(result[index] || 0, cell.textContent?.trim().length || 0);
        });
    }, []);

    const plainTextRows = rows.map((row) => {
        return Array.from(row.cells, (cell, index) => {
            const content = cell.textContent?.trim() || '';
            return content.padEnd(columnWidths[index], '\xa0'); // &nbsp;
        }).join(' | ');
    });

    return plainTextRows.join('<br/>');
}
