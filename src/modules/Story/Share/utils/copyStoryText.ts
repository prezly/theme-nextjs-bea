const DEFAULT_ARTICLE_SELECTOR = 'article';

type TagName = string;
type Attribute = string;
const ELEMENTS_ATTRIBUTES_WHITELIST: Record<TagName, Attribute[]> = {
    A: ['href', 'target'],
};

export function copyStoryText(articleElementSelector = DEFAULT_ARTICLE_SELECTOR) {
    const element = document.querySelector<HTMLElement>(articleElementSelector);

    if (!element) {
        return;
    }

    try {
        const html = getArticleHtml(element);

        const clipboardItem = new ClipboardItem({
            'text/html': html && new Blob([html], { type: 'text/html' }),
            'text/plain': import('./getArticleText')
                .then(({ getArticleText }) => getArticleText(element))
                .catch(() => element.innerText)
                .then((text) => {
                    if (!text) {
                        return '';
                    }

                    return new Blob([text], { type: 'text/plain' });
                }),
        });

        navigator.clipboard.write([clipboardItem]);
    } catch {
        const text = element.innerText;
        if (text) {
            navigator.clipboard.writeText(text);
        }
    }
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
