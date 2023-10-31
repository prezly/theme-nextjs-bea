/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * Based on https://github.com/y-nk/nonorepo/blob/711b9784c8c2bbf53a8036938f2b925c6b1e7b6b/cached-fetch/src/getCacheKey.ts#L1C1-L48C2
 */
export function getCacheKey(...args: Parameters<typeof fetch>) {
    const [input, init] = args;

    const req = !(input instanceof Request) ? new Request(input, init) : input;

    // only cache `GET` and `POST` methods
    if (req.method.toLowerCase() !== 'get' && req.method.toLowerCase() !== 'post') {
        return false;
    }

    const keys: (keyof Request)[] = [
        //    'cache', // string -> makes no sense from "only-if-cached" PoV, but for dedupe maybe?
        'credentials', // string
        'destination', // string
        'integrity', // string
        'method', // string
        'mode', // string
        'redirect', // string
        'referrer', // string
        'referrerPolicy', // string
        'url', // string
    ];

    // header keys should be lowercase
    const headers: [string, string][] = [];
    req.headers.forEach((value, key) => {
        headers.push([key.toLowerCase(), value ?? '']);
    });

    const fingerprint = [
        headers.sort((a, b) => cmp(a, b)),
        ...keys.map((key) => [key, req[key] ?? '']),
    ];

    return JSON.stringify(fingerprint);
}

function cmp(a: [string, string], b: [string, string]): number;
function cmp(a: string, b: string): number;
function cmp<T extends string | [string, string]>(a: T, b: T): number {
    if (typeof a === 'string' || typeof b === 'string') {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    }
    return cmp(a[0], b[0]) || cmp(a[1], b[1]);
}
