export const DEFAULT_TARGET = 'https://t3code-9b280e28.bea.app.homer.prezly.dev';

export const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
    'Googlebot/2.1 (+http://www.google.com/bot.html)',
];

export function assertSafeTarget(rawTarget, allowRemote = false) {
    const target = new URL(rawTarget);
    if (!['http:', 'https:'].includes(target.protocol)) {
        throw new Error(`Unsupported target protocol: ${target.protocol}`);
    }
    const local =
        target.hostname === 'localhost' ||
        target.hostname === '127.0.0.1' ||
        target.hostname.endsWith('.localhost') ||
        target.hostname.endsWith('.homer.prezly.dev');
    if (!local && !allowRemote) {
        throw new Error(
            `Refusing to load test non-local target ${target.origin}. Pass --allow-remote explicitly.`,
        );
    }
    return target;
}

export function classifyCache(headers) {
    const raw = headers['x-prezly-cache'] ?? headers['x-cache'] ?? '';
    const value = raw.toLowerCase();
    if (value.includes('hit')) return 'hit';
    if (value.includes('miss')) return 'miss';
    if (value.includes('pass') || value.includes('bypass')) return 'pass';
    return 'unknown';
}
