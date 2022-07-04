// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text);
};

const fallbackCopyTextToClipboard = (text: any) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand("copy");
    } catch (err) {
        console.error("fallbackCopyTextToClipboard: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
};

export default copyTextToClipboard;
