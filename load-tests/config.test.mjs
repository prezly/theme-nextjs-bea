import assert from 'node:assert/strict';
import test from 'node:test';
import { assertSafeTarget, classifyCache } from './config.mjs';

test('accepts local targets and rejects remote targets by default', () => {
    assert.equal(assertSafeTarget('http://localhost:3000').origin, 'http://localhost:3000');
    assert.equal(
        assertSafeTarget('https://branch.bea.app.homer.prezly.dev').hostname,
        'branch.bea.app.homer.prezly.dev',
    );
    assert.throws(() => assertSafeTarget('https://example.com'), /Refusing/);
    assert.equal(assertSafeTarget('https://example.com', true).origin, 'https://example.com');
});

test('normalizes both cache response header conventions', () => {
    assert.equal(classifyCache({ 'x-prezly-cache': 'Hit' }), 'hit');
    assert.equal(classifyCache({ 'x-cache': 'MISS from edge' }), 'miss');
    assert.equal(classifyCache({ 'x-cache': 'PASS' }), 'pass');
    assert.equal(classifyCache({}), 'unknown');
});
