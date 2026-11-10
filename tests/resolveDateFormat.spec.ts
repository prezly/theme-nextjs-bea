import { formatDate, type Locale } from '@prezly/theme-kit-nextjs';
import { expect, test } from '@playwright/test';

import { resolveDateFormat } from '../src/utils/resolveDateFormat';

const TIMEZONE = 'Asia/Hong_Kong';
const SEPTEMBER_22 = new Date('2026-09-22T04:00:00Z');
const OCTOBER_1 = new Date('2026-10-01T04:00:00Z');

function render(date: Date, locale: Locale.Code, newsroomFormat: string | undefined) {
    return formatDate(date, {
        locale,
        timezone: TIMEZONE,
        dateFormat: resolveDateFormat(locale, newsroomFormat),
    });
}

test.describe('resolveDateFormat', () => {
    test('keeps the newsroom format for Latin-script locales', () => {
        expect(resolveDateFormat('en', 'MMM D, YY')).toBe('MMM D, YY');
        expect(resolveDateFormat('en_HK', 'MMM D, YY')).toBe('MMM D, YY');
        expect(resolveDateFormat('nl_BE', 'DD/MM/YYYY')).toBe('DD/MM/YYYY');
    });

    test('drops the newsroom format for Chinese, Japanese and Korean locales', () => {
        for (const locale of ['ja', 'ja_JP', 'ja-JP', 'zh_HK', 'zh-Hant-HK', 'zh_CN', 'ko', 'ko_KR']) {
            expect(resolveDateFormat(locale, 'MMM D, YY'), locale).toBeUndefined();
        }
    });

    test('returns undefined when the newsroom has no format', () => {
        expect(resolveDateFormat('en', undefined)).toBeUndefined();
        expect(resolveDateFormat('en', '')).toBeUndefined();
    });
});

test.describe('rendered story dates', () => {
    test('en follows the newsroom format', () => {
        expect(render(SEPTEMBER_22, 'en', 'MMM D, YY')).toBe('Sep 22, 26');
    });

    test('en with an existing numeric newsroom format', () => {
        expect(render(SEPTEMBER_22, 'en', 'DD/MM/YYYY')).toBe('22/09/2026');
        expect(render(SEPTEMBER_22, 'nl_BE', 'DD.MM.YYYY')).toBe('22.09.2026');
    });

    test('zh-HK uses the native Chinese date', () => {
        expect(render(SEPTEMBER_22, 'zh_HK', 'MMM D, YY')).toBe('2026年9月22日');
    });

    test('ja-JP keeps the month marker', () => {
        expect(render(OCTOBER_1, 'ja_JP', 'MMM D, YY')).toBe('2026年10月1日');
    });

    test('ko-KR uses the native Korean date', () => {
        expect(render(OCTOBER_1, 'ko_KR', 'MMM D, YY')).toBe('2026년 10월 1일');
    });

    test('without the fix, CJK locales mangle the newsroom format', () => {
        const raw = (date: Date, locale: Locale.Code) =>
            formatDate(date, { locale, timezone: TIMEZONE, dateFormat: 'MMM D, YY' });
        expect(raw(SEPTEMBER_22, 'zh_HK')).toBe('9月 22, 26');
        expect(raw(OCTOBER_1, 'ja_JP')).toBe('10 1, 26') // month marker 月 is a separate literal part and gets lost;
    });
});
