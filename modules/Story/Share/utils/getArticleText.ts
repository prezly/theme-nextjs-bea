import { htmlToText } from './htmlToText';

const MAX_DESIRED_CELL_WIDTH = 30;

export async function getArticleText(element: HTMLElement): Promise<string> {
    const clonedElement = element.cloneNode(true) as HTMLElement;

    clonedElement.querySelectorAll('table').forEach((node) => {
        node.textContent = htmlTableToPlainText(node);
    });

    return htmlToText(clonedElement.innerHTML);
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
    const rowSeparator = `\n${'─'.repeat(rowLength)}\n`;

    return rowsLines
        .flatMap((row) => {
            const rowHeight = Math.max(...row.map((text) => text.split('\n').length));

            return Array.from({ length: rowHeight }, (_, lineIndex) =>
                row
                    .map((cell, columnIndex) => {
                        const lineText = cell.split('\n')[lineIndex] ?? '';
                        return lineText.padEnd(columnWidths[columnIndex], '\xa0'); // &nbsp;
                    })
                    .join(columnSeparator),
            ).join('\n');
        })
        .join(rowSeparator);
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
