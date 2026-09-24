import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

// k6 resolves open() relative to this script, not the caller's working directory.
const manifest = JSON.parse(open(__ENV.MANIFEST || './artifacts/browser-audit.json'));
const target = (__ENV.TARGET || manifest.target).replace(/\/$/, '');
const hostHeader = __ENV.HOST_HEADER;
const profile = __ENV.PROFILE || 'smoke';
const includeAssets = __ENV.ASSETS || 'local';
const thinkTime = Number(__ENV.THINK_TIME || 1);
const maxBatch = Number(__ENV.MAX_BATCH || 20);
const minimumDocumentHitRate = __ENV.MIN_DOCUMENT_HIT_RATE;

if (!['none', 'local', 'all'].includes(includeAssets)) {
    throw new Error(`Unknown ASSETS mode ${includeAssets}`);
}
if (!Number.isFinite(thinkTime) || thinkTime < 0) throw new Error('THINK_TIME must be at least 0');
if (!Number.isInteger(maxBatch) || maxBatch < 1) {
    throw new Error('MAX_BATCH must be a positive integer');
}

const profiles = {
    verify: [{ duration: '2s', target: 1 }],
    smoke: [
        { duration: '1s', target: 2 },
        { duration: '19s', target: 2 },
    ],
    warm: [{ duration: '1m', target: 25 }],
    ramp: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 500 },
        { duration: '2m', target: 0 },
    ],
    spike: [
        { duration: '30s', target: 100 },
        { duration: '30s', target: 2000 },
        { duration: '2m', target: 2000 },
        { duration: '1m', target: 0 },
    ],
    soak: [
        { duration: '5m', target: 500 },
        { duration: '55m', target: 500 },
        { duration: '5m', target: 0 },
    ],
};

if (!profiles[profile]) throw new Error(`Unknown PROFILE ${profile}`);
if (
    !target.includes('.homer.prezly.dev') &&
    !target.includes('localhost') &&
    !target.includes('127.0.0.1') &&
    __ENV.ALLOW_REMOTE !== 'true'
) {
    throw new Error(`Refusing non-local target ${target}; set ALLOW_REMOTE=true explicitly`);
}

const thresholds = {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000', 'p(99)<2500'],
    checks: ['rate>0.99'],
};
if (minimumDocumentHitRate) {
    thresholds['cache_hit_rate{kind:document}'] = [`rate>${minimumDocumentHitRate}`];
}

export const options = {
    scenarios: {
        newsroom: {
            executor: 'ramping-vus',
            stages: profiles[profile],
            gracefulRampDown: '10s',
        },
    },
    batch: maxBatch,
    batchPerHost: maxBatch,
    discardResponseBodies: true,
    thresholds,
};

const routes = new SharedArray('routes', () =>
    manifest.routes
        .filter((route) => !route.error && route.status < 500)
        .map((route) => route.path),
);
if (routes.length === 0) throw new Error('The browser manifest contains no successful routes');
const resourcesByRoute = new SharedArray('resources', () => {
    const seen = new Set();
    return manifest.requests
        .filter((request) => request.method === 'GET')
        .filter((request) => includeAssets === 'all' || request.local)
        .filter((request) => request.resourceType !== 'document')
        .filter((request) => {
            const key = `${request.route}\0${request.url}\0${JSON.stringify(request.requestHeaders)}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .map((request) => {
            const scheme = request.url.indexOf('://');
            const pathStart = request.url.indexOf('/', scheme + 3);
            const path = pathStart === -1 ? '/' : request.url.slice(pathStart);
            return {
                ...request,
                replayUrl: request.local ? `${target}${path}` : request.url,
                name: path,
            };
        });
});

const cacheHits = new Counter('cache_hits');
const cacheMisses = new Counter('cache_misses');
const cachePasses = new Counter('cache_passes');
const cacheUnknown = new Counter('cache_unknown');
const cacheHitRate = new Rate('cache_hit_rate');
const requestDuration = new Trend('load_request_duration', true);

const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.6 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',
    'Googlebot/2.1 (+http://www.google.com/bot.html)',
];

function cacheStatus(response) {
    const raw = String(
        response.headers['X-Prezly-Cache'] || response.headers['X-Cache'] || '',
    ).toLowerCase();
    if (raw.includes('hit')) return 'hit';
    if (raw.includes('miss')) return 'miss';
    if (raw.includes('pass') || raw.includes('bypass')) return 'pass';
    return 'unknown';
}

function record(response, tags) {
    const cache = cacheStatus(response);
    const resultTags = {
        ...tags,
        cache,
        status: String(response.status),
        expected_response: String(response.status < 500),
    };
    requestDuration.add(response.timings.duration, resultTags);
    if (cache === 'hit') cacheHits.add(1, resultTags);
    else if (cache === 'miss') cacheMisses.add(1, resultTags);
    else if (cache === 'pass') cachePasses.add(1, resultTags);
    else cacheUnknown.add(1, resultTags);
    if (cache !== 'unknown') cacheHitRate.add(cache === 'hit', resultTags);
}

function requestHeaders(headers, userAgent) {
    const result = { ...headers, 'User-Agent': userAgent };
    if (hostHeader) result.Host = hostHeader;
    return result;
}

export default function () {
    const route = routes[exec.scenario.iterationInTest % routes.length];
    const userAgent = agents[(__VU + exec.scenario.iterationInTest) % agents.length];
    group(`page ${route}`, () => {
        const document = http.get(`${target}${route}`, {
            headers: requestHeaders({ Accept: 'text/html,application/xhtml+xml' }, userAgent),
            tags: { route, kind: 'document', name: route },
        });
        record(document, { route, kind: 'document', name: route });
        check(document, {
            'document status is below 500': (response) => response.status < 500,
        });

        if (includeAssets !== 'none') {
            const assets = resourcesByRoute.filter((request) => request.route === route);
            for (let offset = 0; offset < assets.length; offset += maxBatch) {
                const batch = assets.slice(offset, offset + maxBatch).map((request) => ({
                    method: 'GET',
                    url: request.replayUrl,
                    params: {
                        headers: requestHeaders(request.requestHeaders, userAgent),
                        tags: {
                            route,
                            kind: request.resourceType,
                            name: request.name,
                        },
                    },
                }));
                const responses = http.batch(batch);
                for (let index = 0; index < responses.length; index += 1) {
                    record(responses[index], batch[index].params.tags);
                }
            }
        }
    });
    if (thinkTime > 0) sleep(thinkTime * (0.75 + Math.random() * 0.5));
}
