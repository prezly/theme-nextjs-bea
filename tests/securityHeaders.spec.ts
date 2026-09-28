import { expect, test } from '@playwright/test';

import nextConfig from '../next.config';

const CONTENT_SECURITY_POLICY = 'Content-Security-Policy';

interface HeaderRule {
    headers: Array<{ key: string; value: string }>;
    has?: Array<{ type: string; key: string; value?: string }>;
}

test('only allows same-origin framing for public pages', async () => {
    const rules = (await nextConfig.headers()) as HeaderRule[];
    const publicRule = rules.find((rule) => !rule.has);
    const policy = publicRule?.headers.find(({ key }) => key === CONTENT_SECURITY_POLICY)?.value;

    expect(policy).toBe(
        "upgrade-insecure-requests; report-uri https://csp.prezly.net/report; frame-ancestors 'self'",
    );
});

test('allows Rock to frame explicit preview responses', async () => {
    const rules = (await nextConfig.headers()) as HeaderRule[];
    const previewRule = rules.find((rule) =>
        rule.has?.some(
            (condition) =>
                condition.type === 'query' &&
                condition.key === 'preview' &&
                condition.value === 'true',
        ),
    );
    const policy = previewRule?.headers.find(({ key }) => key === CONTENT_SECURITY_POLICY)?.value;

    expect(policy).toBe(
        "upgrade-insecure-requests; report-uri https://csp.prezly.net/report; frame-ancestors 'self' https://rock.prezly.com",
    );
    expect(policy).not.toContain('https://*.prezly.net');
    expect(policy).not.toContain('http://rock.prezly.test');
});
