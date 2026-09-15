import { expect, test } from '@playwright/test';
import { NextRequest, NextResponse } from 'next/server';

import {
    isNotFoundRewrite,
    markNotFoundRewrite,
    NOT_FOUND_REQUEST_HEADER,
    NOT_FOUND_REQUEST_VALUE,
    NOT_FOUND_REWRITE_SLUG,
    type NotFoundRewriteLog,
} from '../src/adapters/server/not-found-rewrite';

/** What IntlMiddleware returns for an unmatched path. */
function intlNotFound(locale = 'en') {
    return NextResponse.rewrite(new URL(`https://example.test/${locale}/${NOT_FOUND_REWRITE_SLUG}`), {
        headers: { 'X-Prezly-Locale-Code': locale },
    });
}

function run(path: string, requestHeaders: Record<string, string> = {}) {
    const logs: NotFoundRewriteLog[] = [];
    const request = new NextRequest(`https://example.test${path}`, { headers: requestHeaders });
    const response = markNotFoundRewrite(request, intlNotFound(), (entry) => logs.push(entry));
    return {
        rewrite: response.headers.get('x-middleware-rewrite'),
        marker: response.headers.get(`x-middleware-request-${NOT_FOUND_REQUEST_HEADER}`),
        forwarded: response.headers.get('x-middleware-override-headers'),
        locale: response.headers.get('X-Prezly-Locale-Code'),
        logs,
    };
}

test('recognizes the IntlMiddleware not-found rewrite and nothing else', () => {
    expect(isNotFoundRewrite(intlNotFound())).toBe(true);
    expect(isNotFoundRewrite(intlNotFound('fr_BE'))).toBe(true);
    expect(
        isNotFoundRewrite(NextResponse.rewrite(new URL('https://example.test/en/some-story'))),
    ).toBe(false);
    expect(
        isNotFoundRewrite(
            NextResponse.rewrite(new URL(`https://example.test/en/${NOT_FOUND_REWRITE_SLUG}-story`)),
        ),
    ).toBe(false);
    expect(isNotFoundRewrite(NextResponse.next())).toBe(false);
    expect(isNotFoundRewrite(NextResponse.redirect('https://example.test/'))).toBe(false);
});

test('marks the rewrite, forwards the original headers and keeps the locale header', () => {
    const result = run('/manager-svc/swagger.json', { 'X-Newsroom-Uuid': 'room-1' });
    expect(result.rewrite).toBe(`https://example.test/en/${NOT_FOUND_REWRITE_SLUG}`);
    expect(result.marker).toBe(NOT_FOUND_REQUEST_VALUE);
    expect(result.forwarded).toContain('x-newsroom-uuid');
    expect(result.forwarded).toContain(NOT_FOUND_REQUEST_HEADER);
    expect(result.locale).toBe('en');
    expect(result.logs).toEqual([
        {
            event: 'newsroom_not_found_rewrite',
            reason: 'unmatched_path',
            path: '/manager-svc/swagger.json',
        },
    ]);
});

for (const [path, reason] of [
    ['/favicon.ico', 'scanner_extension'],
    ['/.env.local', 'dotfile'],
    ['/tel:+918455683071', 'forbidden_character'],
    ['/%zz', 'invalid_encoding'],
    ['/ready-player-one', 'unmatched_path'],
] as const) {
    test(`logs ${reason} for ${path}`, () => {
        expect(run(path).logs).toEqual([{ event: 'newsroom_not_found_rewrite', reason, path }]);
    });
}

test('leaves a response without a rewrite untouched', () => {
    const request = new NextRequest('https://example.test/x');
    const next = NextResponse.next();
    expect(markNotFoundRewrite(request, next, () => {})).toBe(next);
});
