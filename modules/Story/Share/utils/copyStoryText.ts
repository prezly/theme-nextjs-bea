/* eslint-disable @typescript-eslint/naming-convention */
const DEFAULT_ARTICLE_SELECTOR = 'article';

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

    const text = getArticleText(element);

    if (!text) {
        return;
    }

    try {
        const html = getArticleHtml(element);
        const textBlob = new Blob([text], { type: 'text/plain' });
        const htmlBlob = html && new Blob([html], { type: 'text/html' });

        const data = [
            new ClipboardItem({
                'text/plain': textBlob,
                ...(htmlBlob ? { 'text/html': htmlBlob } : {}),
            }),
        ];

        await navigator.clipboard.write(data);
    } catch {
        await navigator.clipboard.writeText(text);
    }
}

function getArticleText(element: HTMLElement): string | undefined {
    return element.innerText;
}

function getArticleHtml(element: HTMLElement): string | undefined {
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
