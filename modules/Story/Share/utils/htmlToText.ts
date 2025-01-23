'use server';

import { convert } from 'html-to-text';

export async function htmlToText(html: string) {
    return convert(html, {
        selectors: [
            { selector: 'a', format: 'inline' },
            { selector: 'img', format: 'skip' },
            { selector: 'figure', format: 'skip' },
        ],
    });
}
