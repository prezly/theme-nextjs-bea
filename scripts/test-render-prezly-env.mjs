import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bea-env-renderer-'));
const output = path.join(directory, 'prezly-env.conf');

try {
    execFileSync(process.execPath, [path.join(root, 'scripts/render-prezly-env.mjs')], {
        env: {
            BEA_ENV_OUTPUT: output,
            PREZLY_ACCESS_TOKEN: 'token-with-characters_123',
            PREZLY_NEWSROOM_UUID: '578e78e9-9a5b-44ad-bda2-5214895ee036',
            PREZLY_THEME_UUID: '73015107-ac86-418b-9120-4ffa439d5c0f',
            SHOULD_NOT_LEAK: 'secret',
        },
    });

    const config = fs.readFileSync(output, 'utf8');
    const match = config.match(/base64,([A-Za-z0-9+/=]+)"/);
    assert(match, 'generated nginx configuration contains a base64 data URI');
    const payload = JSON.parse(Buffer.from(match[1], 'base64').toString());
    assert.deepEqual(payload, {
        PREZLY_ACCESS_TOKEN: 'token-with-characters_123',
        PREZLY_NEWSROOM_UUID: '578e78e9-9a5b-44ad-bda2-5214895ee036',
        PREZLY_THEME_UUID: '73015107-ac86-418b-9120-4ffa439d5c0f',
    });
    assert.match(
        config,
        /map \$host \$prezly_newsroom_uuid \{\n    default "578e78e9-9a5b-44ad-bda2-5214895ee036";/,
    );
    assert.match(config, /map \$host \$prezly_newsroom_theme \{\n    default "bea";/);
    assert.equal(fs.statSync(output).mode & 0o777, 0o600);
} finally {
    fs.rmSync(directory, { recursive: true, force: true });
}

console.log('Prezly runtime header renderer tests passed.');
