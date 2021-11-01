import { IncomingMessage } from 'http';

export default function hasLocaleInUrl(req: IncomingMessage, locale?: string) {
    if (process.browser) {
        throw new Error('"hasLocaleInUrl" should only be used on back-end side.');
    }

    const { url } = req;
    return Boolean(locale && url && url.indexOf(locale) !== -1);
}
