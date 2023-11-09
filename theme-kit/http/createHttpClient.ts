/* eslint-disable @typescript-eslint/no-use-before-define */

'use client';

export type Fetch = typeof fetch;

interface Options {
    fetch?: Fetch;
    headers?: Record<string, string>;
}

export interface HttpClient {
    get<T>(url: string, query?: Record<string, string | number | undefined | null>): Promise<T>;
    withHeaders(headers: Record<string, string>): HttpClient;
}

export function createHttpClient(options: Options = {}): HttpClient {
    const fetchImpl = options.fetch ?? fetch;
    const headers = options.headers ?? {};

    return {
        async get(path, query = {}) {
            const searchParams = Object.entries(query)
                .filter(([, value]) => value !== null && value !== undefined)
                .reduce<string[]>(
                    (result, [name, value]) => [
                        ...result,
                        `${name}=${encodeURIComponent(value ?? '')}`,
                    ],
                    [],
                )
                .join('&');

            const url = searchParams ? `${path}?${searchParams}` : path;

            const response = await fetchImpl(url, { headers });

            if (!response.ok) {
                const status = {
                    code: response.status,
                    text: response.statusText,
                };
                throw new HttpError(status, response.headers, await response.text());
            }

            return response.json();
        },

        withHeaders(extraHeaders) {
            return createHttpClient({
                ...options,
                headers: { ...headers, ...extraHeaders },
            });
        },
    };
}

interface Status {
    code: number;
    text: string;
}

export class HttpError extends Error {
    public readonly status: Status;

    public readonly body: string | undefined;

    public readonly headers: Headers;

    constructor(status: Status, headers: Headers, body?: string | undefined) {
        super(status.text);

        this.status = status;
        this.headers = headers;
        this.body = body;
    }
}
