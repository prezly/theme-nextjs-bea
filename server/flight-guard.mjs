import { once } from 'node:events';
import http from 'node:http';
import net from 'node:net';
import { pipeline } from 'node:stream';

/**
 * Reverse proxy in front of Next.js that certifies complete, error-free
 * React Server Components (Flight) responses.
 *
 * Next.js streams Flight payloads, so a data error that happens after the
 * first byte still ends as HTTP 200 with an error row inside the body. A
 * shared cache keyed on status alone would retain that error until its TTL
 * runs out. This proxy buffers `text/x-component` responses, parses the
 * Flight row framing, and adds `X-Prezly-Render: complete` only when the
 * upstream stream ended cleanly, every row referenced by another row is
 * present, and no error row exists. Everything else (HTML, assets, API
 * routes) streams through untouched.
 */

export const RENDER_HEADER = 'x-prezly-render';
export const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
/** Upstream must answer with headers within this time; Varnish gives up earlier. */
const UPSTREAM_TIMEOUT = 120_000;

const FLIGHT_CONTENT_TYPE = /^text\/x-component(;|$)/i;
const HOP_BY_HOP = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
]);

// Row tags whose payload is `<hex byte length>,<raw bytes>` with no newline:
// text (T) and the typed-array family. Matches the Flight client's
// processFullBinaryRow / ROW_CHUNK_BY_LENGTH handling in React 19.
const LENGTH_PREFIXED_TAGS = new Set([...'TAOoUSsLlGgMmV'].map((c) => c.charCodeAt(0)));
const TAG_ERROR = 0x45; // 'E'
// Model references that must resolve to a row: "$<id>", "$L<id>" (lazy) and
// "$@<id>" (promise), optionally followed by a ":path". Literal strings that
// start with a dollar sign are escaped as "$$" by the server.
const ROW_REFERENCE = /"\$(?:L|@)?([0-9a-f]+)(?::[^"]*)?"/g;

/**
 * Walks the Flight row framing used by React 19 (`<id>:<tag><data>\n`, and
 * `<id>:<tag><hex byte length>,<raw bytes>` for text and binary rows, which
 * carry no newline and whose content may itself look like a row). Reports
 * the error digests found in `E` rows, references to rows that never
 * arrived, and whether the framing was consistent to the last byte.
 *
 * @param {Buffer} body
 * @returns {{ complete: boolean, errors: string[], rows: number, reason?: string, missing?: string[] }}
 */
export function inspectFlight(body) {
    const errors = [];
    const ids = new Set();
    const referenced = new Set();
    let rows = 0;
    let offset = 0;
    const length = body.length;
    while (offset < length) {
        const colon = body.indexOf(0x3a, offset); // ':'
        if (colon === -1) return { complete: false, errors, rows, reason: 'unterminated_row_id' };
        if (colon === offset || !isHex(body, offset, colon)) {
            return { complete: false, errors, rows, reason: 'invalid_row_id' };
        }
        ids.add(body.toString('latin1', offset, colon));
        const tag = body[colon + 1];
        if (tag === undefined) return { complete: false, errors, rows, reason: 'missing_row_tag' };
        if (LENGTH_PREFIXED_TAGS.has(tag)) {
            const comma = body.indexOf(0x2c, colon + 2); // ','
            if (comma === -1 || comma === colon + 2 || !isHex(body, colon + 2, comma)) {
                return { complete: false, errors, rows, reason: 'invalid_row_length' };
            }
            const size = Number.parseInt(body.toString('latin1', colon + 2, comma), 16);
            const end = comma + 1 + size;
            if (end > length) return { complete: false, errors, rows, reason: 'truncated_row' };
            offset = end;
            rows += 1;
            continue;
        }
        const newline = body.indexOf(0x0a, colon + 1); // '\n'
        if (newline === -1) return { complete: false, errors, rows, reason: 'truncated_row' };
        if (tag === TAG_ERROR) {
            // Production payloads carry only a digest.
            const json = body.toString('utf8', colon + 2, newline);
            const digest = /"digest":"([^"]*)"/.exec(json);
            errors.push(digest ? digest[1] : json.slice(0, 120));
        } else {
            const row = body.toString('utf8', colon + 1, newline);
            for (const match of row.matchAll(ROW_REFERENCE)) referenced.add(match[1]);
        }
        offset = newline + 1;
        rows += 1;
    }
    if (rows === 0) return { complete: false, errors, rows, reason: 'empty' };
    if (errors.length > 0) return { complete: false, errors, rows, reason: 'error_row' };
    const missing = [...referenced].filter((id) => !ids.has(id));
    if (missing.length > 0)
        return { complete: false, errors, rows, reason: 'missing_row', missing };
    return { complete: true, errors, rows };
}

function isHex(buffer, start, end) {
    for (let i = start; i < end; i += 1) {
        const c = buffer[i];
        const hex =
            (c >= 0x30 && c <= 0x39) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46);
        if (!hex) return false;
    }
    return true;
}

/**
 * @param {string[]} raw
 * @param {Set<string>} drop
 * @returns {Record<string, string | string[]>}
 */
function copyHeaders(raw, drop) {
    /** @type {Record<string, string | string[]>} */
    const headers = {};
    const hopByHop = new Set(HOP_BY_HOP);
    for (let i = 0; i < raw.length; i += 2) {
        if (raw[i].toLowerCase() === 'connection') {
            for (const token of raw[i + 1].split(',')) hopByHop.add(token.trim().toLowerCase());
        }
    }
    for (let i = 0; i < raw.length; i += 2) {
        const name = raw[i].toLowerCase();
        if (hopByHop.has(name) || drop.has(name)) continue;
        const value = raw[i + 1];
        const existing = headers[name];
        if (existing === undefined) headers[name] = value;
        else if (Array.isArray(existing)) existing.push(value);
        else headers[name] = [existing, value];
    }
    return headers;
}

/**
 * @param {object} options
 * @param {number} options.upstreamPort Port Next.js listens on.
 * @param {string} [options.upstreamHost]
 * @param {number} [options.maxBytes] Largest Flight body that is inspected.
 * @param {(entry: Record<string, unknown>) => void} [options.log]
 * @returns {http.Server}
 */
export function createFlightGuard({
    upstreamHost = '127.0.0.1',
    upstreamPort,
    maxBytes = DEFAULT_MAX_BYTES,
    log = (entry) => console.log(entry),
} = {}) {
    if (!Number.isInteger(upstreamPort)) throw new TypeError('upstreamPort is required');
    const agent = new http.Agent({ keepAlive: true, maxSockets: 256 });

    return http.createServer((req, res) => {
        const isFlight = req.headers.rsc === '1' && (req.method === 'GET' || req.method === 'HEAD');
        // Next.js gzips when asked. Ask for identity on Flight requests so the
        // body can be parsed as sent; Varnish and Cloudflare compress downstream.
        const drop = new Set(isFlight ? [RENDER_HEADER, 'accept-encoding'] : [RENDER_HEADER]);
        const upstream = http.request({
            agent,
            host: upstreamHost,
            port: upstreamPort,
            method: req.method,
            path: req.url,
            headers: copyHeaders(req.rawHeaders, drop),
            timeout: UPSTREAM_TIMEOUT,
        });
        const fail = (reason) => {
            if (!res.headersSent) res.writeHead(502, { [RENDER_HEADER]: reason });
            res.end();
        };
        // A client that leaves must not pin a Next.js request context, a render
        // and a keep-alive socket: abort the upstream request with it.
        res.on('close', () => {
            if (!res.writableFinished) upstream.destroy();
        });
        req.on('close', () => {
            if (!req.complete) upstream.destroy();
        });
        upstream.on('timeout', () => upstream.destroy(new Error('upstream timed out')));
        upstream.on('error', (error) => {
            if (res.writableEnded) return;
            fail('upstream_unavailable');
            log({ msg: 'flight_guard_upstream_error', path: req.url, error: error.message });
        });

        upstream.on('response', (response) => {
            const headers = copyHeaders(response.rawHeaders, new Set([RENDER_HEADER]));
            const contentType = response.headers['content-type'] ?? '';
            const inspect =
                isFlight &&
                req.method === 'GET' &&
                response.statusCode === 200 &&
                FLIGHT_CONTENT_TYPE.test(contentType);
            // Streams everything left in `response` and tears both sides down if
            // either breaks, so a client never waits on a stream Next.js dropped.
            const stream = () =>
                pipeline(response, res, (error) => {
                    if (error) res.destroy();
                });
            if (!inspect) {
                // Non-200 Flight responses carry no marker either: on a 304 Varnish
                // merges backend headers into the stored object, and a value here
                // would overwrite the certification of the object it revalidates.
                res.writeHead(response.statusCode, response.statusMessage, headers);
                stream();
                return;
            }

            const chunks = [];
            let size = 0;
            let settled = false;
            const onData = (chunk) => {
                chunks.push(chunk);
                size += chunk.length;
                if (size <= maxBytes) return;
                // Too large to hold: hand the bytes on as they are, uninspected.
                settled = true;
                response.removeListener('data', onData);
                response.pause();
                headers[RENDER_HEADER] = 'oversize';
                res.writeHead(response.statusCode, response.statusMessage, headers);
                res.write(Buffer.concat(chunks, size));
                chunks.length = 0;
                stream();
                log({
                    msg: 'flight_guard_oversize',
                    path: req.url,
                    host: req.headers.host,
                    max: maxBytes,
                });
            };
            response.on('data', onData);
            response.on('close', () => {
                if (settled || response.complete) return;
                // Next.js dropped the connection before finishing: nothing here is reusable.
                settled = true;
                fail('truncated');
                log({
                    msg: 'flight_guard_truncated',
                    path: req.url,
                    host: req.headers.host,
                    bytes: size,
                });
            });
            response.on('end', () => {
                if (settled) return;
                settled = true;
                const body = Buffer.concat(chunks, size);
                const result = inspectFlight(body);
                headers[RENDER_HEADER] = result.complete ? 'complete' : result.reason;
                headers['content-length'] = String(size);
                res.writeHead(response.statusCode, response.statusMessage, headers);
                res.end(body);
                if (!result.complete) {
                    log({
                        msg: 'flight_guard_incomplete',
                        path: req.url,
                        host: req.headers.host,
                        reason: result.reason,
                        errors: result.errors,
                        missing: result.missing,
                        bytes: size,
                    });
                }
            });
        });
        pipeline(req, upstream, () => undefined);
    });
}

/**
 * Resolves once something accepts TCP connections on the upstream port.
 * @param {{ host?: string, port: number, timeoutMs?: number, intervalMs?: number }} options
 */
export async function waitForUpstream({
    host = '127.0.0.1',
    port,
    timeoutMs = 300_000,
    intervalMs = 250,
}) {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
        const ok = await new Promise((resolve) => {
            const socket = net.connect({ host, port });
            socket.once('connect', () => {
                socket.destroy();
                resolve(true);
            });
            socket.once('error', () => resolve(false));
        });
        if (ok) return;
        if (Date.now() > deadline) {
            throw new Error(`Upstream ${host}:${port} did not start within ${timeoutMs} ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
}

/**
 * @param {http.Server} server
 * @param {number} port
 * @param {string} host
 */
export async function listen(server, port, host) {
    server.listen(port, host);
    await once(server, 'listening');
    return server;
}
