import { expect, test } from '@playwright/test';
import { NextRequest } from 'next/server';

import { middleware } from '../middleware';

// Bots send form uploads (multipart POSTs) to Bea pages. Without a Next-Action
// header, Next.js treats them as no-JavaScript Server Action forms and fails
// them with a 500 (DEV-25060). Bea has no such forms, so the middleware
// refuses them instead.

// The locales header keeps the middleware off the API.
const LOCALES = 'en,nl_BE,fr_BE';
const REQUEST_URL = 'https://example.test/category/news';
const PAGE = 'https://example.test/en/category/news';

function formUpload() {
    const form = new FormData();
    form.append('email', 'scan@example.com');
    return form;
}

test('a form upload POST without a Next-Action header gets a 405', async () => {
    const response = await middleware(
        new NextRequest(REQUEST_URL, {
            method: 'POST',
            headers: { 'X-Newsroom-Locales': LOCALES },
            body: formUpload(),
        }),
    );

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET, HEAD');
});

test('a Server Action call with a form upload still reaches the page', async () => {
    const response = await middleware(
        new NextRequest(REQUEST_URL, {
            method: 'POST',
            headers: { 'X-Newsroom-Locales': LOCALES, 'Next-Action': '7f0123456789abcdef' },
            body: formUpload(),
        }),
    );

    expect(response.status).not.toBe(405);
    expect(response.headers.get('x-middleware-rewrite')).toBe(PAGE);
});

test('a page view still reaches the page', async () => {
    const response = await middleware(
        new NextRequest(REQUEST_URL, { headers: { 'X-Newsroom-Locales': LOCALES } }),
    );

    expect(response.status).not.toBe(405);
    expect(response.headers.get('x-middleware-rewrite')).toBe(PAGE);
});
