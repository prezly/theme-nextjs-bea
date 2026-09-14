import fs from 'node:fs';
import path from 'node:path';

const required = ['PREZLY_ACCESS_TOKEN', 'PREZLY_NEWSROOM_UUID'];
const allowed = [
    'NEXT_PUBLIC_BASE_URL',
    'REDIS_CACHE_URL',
    'PREZLY_ACCESS_TOKEN',
    'PREZLY_NEWSROOM_UUID',
    'PREZLY_THEME_UUID',
    'PREZLY_API_BASEURL',
    'MEILISEARCH_API_KEY',
    'MEILISEARCH_HOST',
    'MEILISEARCH_INDEX',
    'PREZLY_MODE',
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
    console.error(`Missing required values in .env: ${missing.join(', ')}`);
    process.exit(1);
}

const variables = Object.fromEntries(
    allowed.filter((name) => process.env[name]).map((name) => [name, process.env[name]]),
);
const encoded = Buffer.from(JSON.stringify(variables)).toString('base64');
const output = process.env.BEA_ENV_OUTPUT;
if (!output) {
    throw new Error('BEA_ENV_OUTPUT is required');
}

fs.mkdirSync(path.dirname(output), { recursive: true, mode: 0o700 });
const temporary = `${output}.${process.pid}`;
fs.writeFileSync(
    temporary,
    `map $host $prezly_runtime_environment {\n    default "data:application/json;base64,${encoded}";\n}\n`,
    { mode: 0o600 },
);
fs.renameSync(temporary, output);
