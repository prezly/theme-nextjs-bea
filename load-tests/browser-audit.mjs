#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { assertSafeTarget, classifyCache, DEFAULT_TARGET, USER_AGENTS } from './config.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test');

function parseArgs(argv) {
    const options = {
        target: process.env.TARGET ?? DEFAULT_TARGET,
        output: 'load-tests/artifacts/browser-audit.json',
        maxPages: 25,
        maxDepth: 2,
        timeout: 30_000,
        allowRemote: false,
    };
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--allow-remote') options.allowRemote = true;
        else if (argument === '--target') options.target = argv[++index];
        else if (argument === '--output') options.output = argv[++index];
        else if (argument === '--max-pages') options.maxPages = Number(argv[++index]);
        else if (argument === '--max-depth') options.maxDepth = Number(argv[++index]);
        else if (argument === '--timeout') options.timeout = Number(argv[++index]);
        else throw new Error(`Unknown argument: ${argument}`);
    }
    if (!Number.isInteger(options.maxPages) || options.maxPages < 1) {
        throw new Error('--max-pages must be a positive integer');
    }
    return options;
}

function localPath(value, target) {
    try {
        const url = new URL(value, target);
        if (url.origin !== target.origin || !['http:', 'https:'].includes(url.protocol))
            return null;
        url.hash = '';
        return `${url.pathname}${url.search}`;
    } catch {
        return null;
    }
}

function cleanHeaders(headers) {
    const allowed = [
        'accept',
        'content-type',
        'rsc',
        'next-router-prefetch',
        'next-router-segment-prefetch',
        'next-router-state-tree',
        'x-nextjs-data',
    ];
    return Object.fromEntries(Object.entries(headers).filter(([name]) => allowed.includes(name)));
}

function responseRecord(response, route, phase, target) {
    const request = response.request();
    const headers = response.headers();
    const url = new URL(response.url());
    const timing = request.timing();
    return {
        route,
        phase,
        url: response.url(),
        local: url.origin === target.origin,
        resourceType: request.resourceType(),
        method: request.method(),
        status: response.status(),
        cache: classifyCache(headers),
        cacheControl: headers['cache-control'] ?? null,
        age: headers.age ? Number(headers.age) : null,
        contentType: headers['content-type'] ?? null,
        requestHeaders: cleanHeaders(request.headers()),
        timing: {
            startTime: timing.startTime,
            responseStart: timing.responseStart,
            responseEnd: timing.responseEnd,
            ttfb: timing.responseStart >= 0 ? timing.responseStart : null,
            duration: timing.responseEnd >= 0 ? timing.responseEnd : null,
        },
    };
}

async function pageMetrics(page) {
    return page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paints = Object.fromEntries(
            performance.getEntriesByType('paint').map((entry) => [entry.name, entry.startTime]),
        );
        const resources = performance.getEntriesByType('resource');
        return {
            ttfb: navigation ? navigation.responseStart : null,
            domContentLoaded: navigation ? navigation.domContentLoadedEventEnd : null,
            load: navigation ? navigation.loadEventEnd : null,
            firstPaint: paints['first-paint'] ?? null,
            firstContentfulPaint: paints['first-contentful-paint'] ?? null,
            transferBytes: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
            decodedBytes: resources.reduce((sum, entry) => sum + (entry.decodedBodySize || 0), 0),
            resources: resources.length,
        };
    });
}

async function settle(page, timeout) {
    await page.waitForLoadState('domcontentloaded', { timeout });
    await page
        .waitForLoadState('networkidle', { timeout: Math.min(timeout, 10_000) })
        .catch(() => {});
}

const options = parseArgs(process.argv.slice(2));
const target = assertSafeTarget(options.target, options.allowRemote);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: USER_AGENTS[0],
    viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const devtools = await context.newCDPSession(page);
const requests = [];
const pendingResponses = [];
let active = { route: '/', phase: 'document' };
page.on('response', (response) => {
    const attribution = { ...active };
    const record = responseRecord(response, attribution.route, attribution.phase, target);
    requests.push(record);
    const pending = response
        .finished()
        .catch(() => {})
        .then(() => {
            const timing = response.request().timing();
            record.timing.responseEnd = timing.responseEnd;
            record.timing.duration = timing.responseEnd >= 0 ? timing.responseEnd : null;
        });
    pendingResponses.push(pending);
});

const queue = [{ path: '/', parent: null, depth: 0 }];
const queued = new Set(['/']);
const routes = [];

try {
    while (queue.length > 0 && routes.length < options.maxPages) {
        const candidate = queue.shift();
        active = { route: candidate.path, phase: 'document' };
        await devtools.send('Network.clearBrowserCache');
        const started = Date.now();
        let error = null;
        let status = null;
        try {
            const response = await page.goto(new URL(candidate.path, target).href, {
                waitUntil: 'domcontentloaded',
                timeout: options.timeout,
            });
            status = response?.status() ?? null;
            await settle(page, options.timeout);
        } catch (caught) {
            error = caught instanceof Error ? caught.message : String(caught);
        }
        const metrics = error ? null : await pageMetrics(page);
        const links = error
            ? []
            : await page
                  .locator('a[href]')
                  .evaluateAll((anchors) =>
                      anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean),
                  );
        const children = [];
        if (candidate.depth < options.maxDepth) {
            for (const href of links) {
                const path = localPath(href, target);
                if (!path || queued.has(path) || path.startsWith('/api/')) continue;
                queued.add(path);
                children.push(path);
                queue.push({ path, parent: candidate.path, depth: candidate.depth + 1 });
            }
        }
        routes.push({
            path: candidate.path,
            parent: candidate.parent,
            depth: candidate.depth,
            status,
            elapsed: Date.now() - started,
            metrics,
            error,
            discoveredLinks: children,
        });
        process.stdout.write(`document ${status ?? 'ERR'} ${candidate.path}\n`);
    }

    // Next.js emits RSC requests on client-side Link navigation. Replay every
    // discovered edge once so the protocol manifest includes those requests.
    for (const route of routes.filter((item) => item.parent)) {
        try {
            active = { route: route.parent, phase: 'document' };
            await devtools.send('Network.clearBrowserCache');
            await page.goto(new URL(route.parent, target).href, {
                waitUntil: 'domcontentloaded',
                timeout: options.timeout,
            });
            await settle(page, options.timeout);
            const link = page.locator(`a[href=${JSON.stringify(route.path)}]`).first();
            if ((await link.count()) === 0) continue;
            active = { route: route.path, phase: 'client-navigation' };
            await Promise.all([
                page.waitForURL((url) => `${url.pathname}${url.search}` === route.path, {
                    timeout: options.timeout,
                }),
                link.click(),
            ]);
            await settle(page, options.timeout);
            process.stdout.write(`client-nav ${route.path}\n`);
        } catch (error) {
            process.stderr.write(`client-nav ERR ${route.path}: ${error.message}\n`);
        }
    }
} finally {
    // Analytics beacons and streaming responses can remain open indefinitely.
    await Promise.race([Promise.allSettled(pendingResponses), delay(2_000)]);
    await browser.close();
    await Promise.allSettled(pendingResponses);
}

const result = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    target: target.origin,
    options,
    routes,
    requests,
};
const output = resolve(options.output);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
const localRequests = requests.filter((request) => request.local);
const counts = localRequests.reduce((result, request) => {
    result[request.cache] ??= [];
    result[request.cache].push(request);
    return result;
}, {});
process.stdout.write(
    `Wrote ${output}: ${routes.length} pages, ${requests.length} responses, ` +
        `${localRequests.length} local responses, ${counts.hit?.length ?? 0} hits, ` +
        `${counts.miss?.length ?? 0} misses, ${counts.unknown?.length ?? 0} unknown\n`,
);
