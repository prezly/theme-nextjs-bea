import { expect, test } from '@playwright/test';

import { isPossibleStorySlug } from '../src/utils/isPossibleStorySlug';

const ACCEPTED = [
    'on-welcomes-european-champion-jeanne-lehair',
    'story-2',
    'web-2.0-launch',
    'Q3-Results',
    'annual-report-2025.html',
    'brochure.pdf',
    'quelles-perspectives-%C3%A9conomiques',
    'quelles-perspectives-économiques',
    '%E5%9C%8B%E6%B3%B0%E8%88%AA%E7%A9%BA',
    'быстрее-и-лучше',
    '東京オリンピック',
    'Dockerfile',
    '_error404-story',
    'a',
];

const REJECTED = [
    '',
    'favicon.ico',
    'ads.txt',
    'wp-login.php',
    'index.php7',
    'config.json',
    'sitemap-news.xml',
    '.env',
    'main.js',
    'styles.css',
    'logo.png',
    'backup.zip',
    'README.md',
    'tel:+918455683071',
    'mailto:press@example.com',
    'a b',
    'a+b',
    'a%20b',
    'a%2Fb',
    "it's",
    'hello!',
    'x=1&y=2',
    '%E5%9C%8B%E6',
    '%zz',
    '%2525',
];

for (const slug of ACCEPTED) {
    test(`accepts ${JSON.stringify(slug)}`, () => {
        expect(isPossibleStorySlug(slug)).toBe(true);
    });
}

for (const slug of REJECTED) {
    test(`rejects ${JSON.stringify(slug)}`, () => {
        expect(isPossibleStorySlug(slug)).toBe(false);
    });
}

test('is case-insensitive for scanner extensions', () => {
    expect(isPossibleStorySlug('INDEX.PHP')).toBe(false);
    expect(isPossibleStorySlug('Logo.PNG')).toBe(false);
});
