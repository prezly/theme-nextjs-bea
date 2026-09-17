import { once } from 'node:events';
import http from 'node:http';
import net from 'node:net';

/**
 * Reverse proxy in front of Next.js that certifies complete, error-free
 * React Server Components (Flight) responses.
 *
 * Next.js streams Flight payloads, so a data error that happens after the
 * first byte still ends as HTTP 200 with an error row inside the body. A
 * shared cache keyed on status alone would retain that error until its TTL
 * runs out. This proxy buffers `text/x-component` responses, parses the
 * Flight row framing, and adds `X-Prezly-Render: complete` only when the
 * upstream stream ended cleanly and contained no error row. Everything else
 * (HTML, assets, API routes) streams through untouched.
 */

export const RENDER_HEADER = 'x-prezly-render';
export const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;

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

/**
 * Walks the Flight row framing used by React 19: `<id>:<tag><data>\n`, and
 * `<id>:T<hex byte length>,<raw text>` for text rows, which carry no newline
 * and whose content may itself look like a row. Returns the error digests
 * found in `E` rows and whether the framing was consistent to the last byte.
 */
export function inspectFlight(body) {
    const errors = [];
    let rows = 0;
    let offset = 0;
    const length = body.length;
    while (offset < length) {
        const colon = body.indexOf(0x3a, offset); // ':'
        if (colon === -1) return { complete: false, errors, rows, reason: 'unterminated_row_id' };
        if (colon === offset || !isHex(body, offset, colon)) {
            return { complete: false, errors, rows, reason: 'invalid_row_id' };
        }
        const tag = body[colon + 1];
        if (tag === undefined) return { complete: false, errors, rows, reason: 'missing_row_tag' };
        if (tag === 0x54) {
            // 'T': length-prefixed text, counted in bytes, no trailing newline.
            const comma = body.indexOf(0x2c, colon + 2); // ','
            if (comma === -1 || comma === colon + 2 || !isHex(body, colon + 2, comma)) {
                return { complete: false, errors, rows, reason: 'invalid_text_length' };
            }
            const size = Number.parseInt(body.toString('latin1', colon + 2, comma), 16);
            const end = comma + 1 + size;
            if (end > length)
                return { complete: false, errors, rows, reason: 'truncated_text_row' };
            offset = end;
            rows += 1;
            continue;
        }
        const newline = body.indexOf(0x0a, colon + 1); // '\n'
        if (newline === -1) return { complete: false, errors, rows, reason: 'truncated_row' };
        if (tag === 0x45) {
            // 'E': an error row. Production payloads carry only a digest.
            const json = body.toString('utf8', colon + 2, newline);
            const digest = /"digest":"([^"]*)"/.exec(json);
            errors.push(digest ? digest[1] : json.slice(0, 120));
        }
        offset = newline + 1;
        rows += 1;
    }
    if (rows === 0) return { complete: false, errors, rows, reason: 'empty' };
    if (errors.length > 0) return { complete: false, errors, rows, reason: 'error_row' };
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
    for (let i = 0; i < raw.length; i += 2) {
        const name = raw[i].toLowerCase();
        if (HOP_BY_HOP.has(name) || drop.has(name)) continue;
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
    log = (entry) => console.log(JSON.stringify(entry)),
} = {}) {
    if (!Number.isInteger(upstreamPort)) throw new TypeError('upstreamPort is required');
    const agent = new http.Agent({ keepAlive: true, maxSockets: 256 });

    return http.createServer((req, res) => {
        const isFlight = req.headers.rsc === '1' && (req.method === 'GET' || req.method === 'HEAD');
        // Next.js gzips when asked. Ask for identity on Flight requests so the
        // body can be parsed as sent; Varnish and Cloudflare compress downstream.
        const drop = new Set(isFlight ? [RENDER_HEADER, 'accept-encoding'] : [RENDER_HEADER]);
        const upstream = http.request(
            {
                agent,
                host: upstreamHost,
                port: upstreamPort,
                method: req.method,
                path: req.url,
                headers: copyHeaders(req.rawHeaders, drop),
            },
            (response) => {
                const headers = copyHeaders(response.rawHeaders, new Set([RENDER_HEADER]));
                const contentType = response.headers['content-type'] ?? '';
                if (!isFlight || req.method === 'HEAD' || !FLIGHT_CONTENT_TYPE.test(contentType)) {
                    res.writeHead(response.statusCode, response.statusMessage, headers);
                    response.pipe(res);
                    return;
                }
                const chunks = [];
                let size = 0;
                let overflow = false;
                let failed = false;
                response.on('data', (chunk) => {
                    size += chunk.length;
                    if (size > maxBytes) overflow = true;
                    else chunks.push(chunk);
                });
                // Next.js closed the connection before finishing: nothing here is reusable.
                const broken = () => {
                    if (failed) return;
                    failed = true;
                    if (!res.headersSent) res.writeHead(502, { [RENDER_HEADER]: 'truncated' });
                    res.end();
                    log({
                        msg: 'flight_guard_truncated',
                        path: req.url,
                        host: req.headers.host,
                        bytes: size,
                    });
                };
                response.on('aborted', broken);
                response.on('error', broken);
                response.on('end', () => {
                    if (failed) return;
                    if (overflow) {
                        // Too large to inspect; forward without a marker, uncached.
                        headers[RENDER_HEADER] = 'oversize';
                        delete headers['content-length'];
                        res.writeHead(response.statusCode, response.statusMessage, headers);
                        res.end(Buffer.concat(chunks));
                        log({
                            msg: 'flight_guard_oversize',
                            path: req.url,
                            host: req.headers.host,
                            bytes: size,
                            max: maxBytes,
                        });
                        return;
                    }
                    const body = Buffer.concat(chunks, size);
                    const result =
                        response.statusCode === 200
                            ? inspectFlight(body)
                            : {
                                  complete: false,
                                  errors: [],
                                  reason: `status_${response.statusCode}`,
                              };
                    headers[RENDER_HEADER] = result.complete ? 'complete' : result.reason;
                    headers['content-length'] = String(size);
                    res.writeHead(response.statusCode, response.statusMessage, headers);
                    res.end(body);
                    if (!result.complete && response.statusCode === 200) {
                        log({
                            msg: 'flight_guard_incomplete',
                            path: req.url,
                            host: req.headers.host,
                            reason: result.reason,
                            errors: result.errors,
                            bytes: size,
                        });
                    }
                });
            },
        );
        upstream.on('error', (error) => {
            if (!res.headersSent) res.writeHead(502, { [RENDER_HEADER]: 'upstream_unavailable' });
            res.end();
            log({ msg: 'flight_guard_upstream_error', path: req.url, error: error.message });
        });
        req.pipe(upstream);
    });
}

/**
 * Resolves once something accepts TCP connections on the upstream port.
 * @param {{ host?: string, port: number, timeoutMs?: number, intervalMs?: number }} options
 */
export async function waitForUpstream({
    host = '127.0.0.1',
    port,
    timeoutMs = 90_000,
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
