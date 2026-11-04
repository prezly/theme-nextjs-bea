#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createGunzip } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline';

const input = process.argv[2] ?? 'load-tests/artifacts/k6-metrics.json.gz';
const output = process.argv[3] ?? 'load-tests/artifacts/k6-report.md';
const bounds = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 30000, 60000];
const groups = new Map();

function bucket(value) {
    const index = bounds.findIndex((bound) => value <= bound);
    return index === -1 ? bounds.length : index;
}

function add(tags, value) {
    const key = `${tags.name ?? tags.route ?? 'unknown'}\0${tags.kind ?? 'unknown'}`;
    const item = groups.get(key) ?? {
        request: tags.name ?? tags.route ?? 'unknown',
        kind: tags.kind ?? 'unknown',
        count: 0,
        failed: 0,
        total: 0,
        max: 0,
        cache: { hit: 0, miss: 0, pass: 0, unknown: 0 },
        histogram: Array(bounds.length + 1).fill(0),
    };
    item.count += 1;
    item.failed += tags.expected_response === 'false' ? 1 : 0;
    item.total += value;
    item.max = Math.max(item.max, value);
    item.cache[tags.cache ?? 'unknown'] = (item.cache[tags.cache ?? 'unknown'] ?? 0) + 1;
    item.histogram[bucket(value)] += 1;
    groups.set(key, item);
}

function percentile(item, ratio) {
    const target = Math.ceil(item.count * ratio);
    let seen = 0;
    for (let index = 0; index < item.histogram.length; index += 1) {
        seen += item.histogram[index];
        if (seen >= target) return index < bounds.length ? `≤${bounds[index]}` : '>60000';
    }
    return 'n/a';
}

const source = createReadStream(input);
const stream = input.endsWith('.gz') ? source.pipe(createGunzip()) : source;
for await (const line of createInterface({ input: stream, crlfDelay: Number.POSITIVE_INFINITY })) {
    if (!line) continue;
    const point = JSON.parse(line);
    if (point.type !== 'Point' || point.metric !== 'load_request_duration') continue;
    add(point.data.tags ?? {}, point.data.value);
}

const rows = [...groups.values()].sort((a, b) => b.count - a.count);
const markdown = [
    '# k6 request report',
    '',
    `Source: \`${input}\``,
    '',
    '| request | kind | requests | errors | hit | miss | pass | unknown | mean ms | p95 ms | p99 ms | max ms |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...rows.map((item) =>
        [
            item.request.replaceAll('|', '\\|'),
            item.kind,
            item.count,
            item.failed,
            item.cache.hit,
            item.cache.miss,
            item.cache.pass,
            item.cache.unknown,
            (item.total / item.count).toFixed(1),
            percentile(item, 0.95),
            percentile(item, 0.99),
            item.max.toFixed(1),
        ].join(' | '),
    ),
].join('\n');

const destination = resolve(output);
await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, `${markdown}\n`);
process.stdout.write(`Wrote ${destination} with ${rows.length} route/resource groups\n`);
