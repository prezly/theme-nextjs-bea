export default function stripHtmlTags(html: string) {
    if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    return html;
}
