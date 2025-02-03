import { htmlToText } from './htmlToText';

const DEFAULT_ARTICLE_SELECTOR = 'article';

type TagName = string;
type Attribute = string;
const ELEMENTS_ATTRIBUTES_WHITELIST: Record<TagName, Attribute[]> = {
    A: ['href', 'target'],
};
const MAX_DESIRED_CELL_WIDTH = 30;

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
        node.textContent = htmlTableToPlainText(node);
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

    const columnWidths: number[] = rows.reduce<number[]>(
        (result, row) =>
            Array.from(row.cells, (cell, index) => {
                const text = cell.textContent!.trim()!;
                const maxWordLength = Math.max(...text.split(/\s/g).map((word) => word.length));
                const cellWidth =
                    text.length <= MAX_DESIRED_CELL_WIDTH
                        ? text.length
                        : Math.max(MAX_DESIRED_CELL_WIDTH, maxWordLength);

                return Math.max(result[index] || 0, cellWidth);
            }),
        [],
    );

    const rowsLines = rows.map((row) =>
        Array.from(row.cells, (cell, index) => {
            const text = cell.textContent?.trim() || '';
            return wrapText(text, columnWidths[index]);
        }),
    );

    const columnSeparator = '\xa0│\xa0'; // &nbsp;
    const rowLength =
        columnWidths.reduce((sum, columnWidth) => sum + columnWidth) +
        columnSeparator.length * (columnWidths.length - 1);
    const separator = `\n${'─'.repeat(rowLength)}\n`;

    return rowsLines
        .flatMap((row) => {
            const rowHeight = Math.max(...row.map((text) => text.split('\n').length));

            return Array.from({ length: rowHeight }, (_, lineIndex) => {
                return row
                    .map((cell, columnIndex) => {
                        const lineText = cell.split('\n')[lineIndex] ?? '';
                        return lineText.padEnd(columnWidths[columnIndex], '\xa0'); // &nbsp;
                    })
                    .join(columnSeparator);
            }).join('\n');
        })
        .join(separator);
}

function wrapText(text: string, maxLineLength: number): string {
    if (text.length < maxLineLength) {
        return text;
    }

    let currentLineLength = 0;

    return text
        .split(/\s/g)
        .map((word) => {
            const shouldAddSpace = currentLineLength > 0;

            if (currentLineLength + word.length + (shouldAddSpace ? 1 : 0) > maxLineLength) {
                currentLineLength = word.length;
                return `\n${word}`;
            }

            currentLineLength += word.length + (shouldAddSpace ? 1 : 0);
            return (shouldAddSpace ? ' ' : '') + word;
        })
        .join('');
}
