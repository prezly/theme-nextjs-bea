import { expect, test } from '@playwright/test';

import { getStorySlugRejection, isPossibleStorySlug } from '../src/utils/isPossibleStorySlug';

const ACCEPTED = [
    'on-welcomes-european-champion-jeanne-lehair',
    'story-2',
    'web-2.0-launch',
    'Q3-Results',
    'annual-report-2025.html',
    'legacy-page.php',
    'legacy-page.aspx',
    'brochure.pdf',
    'release.md',
    'company.json',
    'nasza-firma.pl',
    'quelles-perspectives-%C3%A9conomiques',
    'quelles-perspectives-économiques',
    '%E5%9C%8B%E6%B3%B0%E8%88%AA%E7%A9%BA',
    'быстрее-и-лучше',
    '東京オリンピック',
    'Dockerfile',
    '_error404',
    'a',
];

const REJECTED: Record<string, ReturnType<typeof getStorySlugRejection>> = {
    '': 'empty',
    'favicon.ico': 'scanner_extension',
    'ads.txt': 'scanner_extension',
    'logo.png': 'scanner_extension',
    'main.js': 'scanner_extension',
    'styles.css': 'scanner_extension',
    'sitemap-news.xml': 'scanner_extension',
    'docker-compose.yml': 'scanner_extension',
    'backup.zip': 'scanner_extension',
    'dump.sql': 'scanner_extension',
    'config.env': 'scanner_extension',
    '.env': 'dotfile',
    '.env.local': 'dotfile',
    '.git': 'dotfile',
    '.dockerfile': 'dotfile',
    'tel:+918455683071': 'forbidden_character',
    'mailto:press@example.com': 'forbidden_character',
    'a b': 'forbidden_character',
    'a+b': 'forbidden_character',
    'a%20b': 'forbidden_character',
    'a%2Fb': 'forbidden_character',
    "it's": 'forbidden_character',
    'hello!': 'forbidden_character',
    'x=1&y=2': 'forbidden_character',
    '%2525': 'forbidden_character',
    '%E5%9C%8B%E6': 'invalid_encoding',
    '%zz': 'invalid_encoding',
};

for (const slug of ACCEPTED) {
    test(`accepts ${JSON.stringify(slug)}`, () => {
        expect(getStorySlugRejection(slug)).toBeUndefined();
        expect(isPossibleStorySlug(slug)).toBe(true);
    });
}

for (const [slug, reason] of Object.entries(REJECTED)) {
    test(`rejects ${JSON.stringify(slug)} as ${reason}`, () => {
        expect(getStorySlugRejection(slug)).toBe(reason);
        expect(isPossibleStorySlug(slug)).toBe(false);
    });
}

test('is case-insensitive for scanner extensions', () => {
    expect(isPossibleStorySlug('Logo.PNG')).toBe(false);
    expect(isPossibleStorySlug('ROBOTS.TXT')).toBe(false);
});
