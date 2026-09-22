#!/usr/bin/env node

import { execFile } from "node:child_process";
import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	stat,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { promisify } from "node:util";

import {
	buildVariants,
	compareReports,
	distribution,
	selectRoutes,
	summarizeHttp,
} from "./lib.mjs";

const execFileAsync = promisify(execFile);
const HARD_CAPS = {
	routes: 25,
	crawlPages: 50,
	httpRepeats: 10,
	httpRps: 5,
	browserRepeats: 5,
	browserRps: 1,
};
const args = parseArgs(process.argv.slice(2));

if (args.help) {
	console.log(`Usage: pnpm benchmark -- --profile <file> [options]

Options:
  --base-url <url>         Override the profile base URL
  --routes <path,...>      Override configured routes
  --baseline <report.json> Compare with a saved report
  --output-dir <directory> Defaults to performance-results
  --http-only              Skip Playwright
  --crawl-only             Crawl and print the selected route list
  --fail-on-regression     Exit non-zero on threshold regressions or failed requests
  --run-invalidation       Run the profile's explicitly safe invalidation scenario`);
	process.exit(0);
}

const profilePath = args.profile ?? "performance/profiles/lifelog.json";
const config = JSON.parse(await readFile(profilePath, "utf8"));
if (args.baseUrl) config.baseUrl = args.baseUrl;
if (args.routes)
	config.routes = args.routes.split(",").map((route) => route.trim());
validateConfig(config);

const startedAt = new Date();
const discoveredRoutes = config.crawl?.enabled ? await crawl(config) : [];
const routes = [
	...new Set([...(config.routes ?? []), ...discoveredRoutes]),
].slice(0, HARD_CAPS.routes);
if (routes.length === 0) throw new Error("No routes configured or discovered");

if (args.crawlOnly) {
	console.log(JSON.stringify({ baseUrl: config.baseUrl, routes }, null, 2));
	process.exit(0);
}

const httpSamples = await runHttp(config, routes);
const browserSamples = args.httpOnly ? [] : await runBrowser(config, routes);
const failures = [
	...httpSamples
		.filter(({ error, status }) => error || status >= 400)
		.map(({ url, phase, status, error }) => ({
			runner: "curl",
			url,
			phase,
			status,
			error,
		})),
	...browserSamples
		.filter(({ error, status }) => error || status >= 400)
		.map(({ url, status, error }) => ({
			runner: "playwright",
			url,
			status,
			error,
		})),
];

const report = {
	schemaVersion: 1,
	metadata: {
		profile: config.name,
		baseUrl: config.baseUrl,
		startedAt: startedAt.toISOString(),
		finishedAt: new Date().toISOString(),
		location: process.env.BENCHMARK_LOCATION ?? config.location ?? "unknown",
		gitSha: process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? null,
		buildId: process.env.BENCHMARK_BUILD_ID ?? null,
		node: process.version,
		coldDefinition:
			"first suite observation; CDN state is reported, not assumed",
		caps: HARD_CAPS,
	},
	config: sanitizeConfig(config),
	routes,
	samples: { http: httpSamples, browser: browserSamples },
	summary: {
		http: summarizeHttp(httpSamples),
		browser: summarizeBrowser(browserSamples),
		failures,
		optionalInstrumentation: summarizeInstrumentation(
			browserSamples,
			httpSamples,
			config,
		),
	},
	comparison: null,
	invalidation: args.runInvalidation
		? await runInvalidation(config, routes[0])
		: null,
};

if (args.baseline) {
	report.comparison = compareReports(
		report,
		JSON.parse(await readFile(args.baseline, "utf8")),
		config.thresholds,
	);
}

const outputDirectory = resolve(args.outputDir ?? "performance-results");
await mkdir(outputDirectory, { recursive: true });
const reportPath = resolve(outputDirectory, "report.json");
const humanPath = resolve(outputDirectory, "report.md");
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(humanPath, renderHumanReport(report));
console.log(renderHumanReport(report));
console.log(`JSON: ${reportPath}`);
console.log(`Human: ${humanPath}`);

if (
	args.failOnRegression &&
	((report.comparison && !report.comparison.passed) || failures.length > 0)
) {
	process.exitCode = 1;
}

function parseArgs(tokens) {
	const parsed = {};
	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index];
		if (!token.startsWith("--"))
			throw new Error(`Unexpected argument: ${token}`);
		const key = token
			.slice(2)
			.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
		const next = tokens[index + 1];
		if (!next || next.startsWith("--")) parsed[key] = true;
		else {
			parsed[key] = next;
			index += 1;
		}
	}
	return parsed;
}

function validateConfig(value) {
	const url = new URL(value.baseUrl);
	if (!["http:", "https:"].includes(url.protocol))
		throw new Error("baseUrl must use HTTP(S)");
	value.http ??= {};
	value.browser ??= {};
	value.thresholds = {
		warmTtfbP95Percent: 20,
		responseBytesMedianPercent: 10,
		browserNavigationP95Percent: 20,
		...value.thresholds,
	};
	value.http.coldRepeats ??= 1;
	value.http.warmupRepeats ??= 1;
	value.http.warmRepeats ??= 3;
	value.http.requestsPerSecond ??= 1;
	value.http.timeoutSeconds ??= 30;
	value.browser.repeats ??= 1;
	value.browser.requestsPerSecond ??= 0.2;
	value.browser.timeoutMs ??= 45_000;
	value.crawl ??= { enabled: false };
	value.crawl.maxPages ??= 10;
	value.crawl.routeCount ??= 5;
	value.crawl.seed ??= 24250;

	const checks = [
		["routes", value.routes?.length ?? 0, HARD_CAPS.routes],
		["crawl.maxPages", value.crawl.maxPages, HARD_CAPS.crawlPages],
		["crawl.routeCount", value.crawl.routeCount, HARD_CAPS.routes],
		["http.coldRepeats", value.http.coldRepeats, HARD_CAPS.httpRepeats],
		["http.warmupRepeats", value.http.warmupRepeats, HARD_CAPS.httpRepeats],
		["http.warmRepeats", value.http.warmRepeats, HARD_CAPS.httpRepeats],
		["http.requestsPerSecond", value.http.requestsPerSecond, HARD_CAPS.httpRps],
		["browser.repeats", value.browser.repeats, HARD_CAPS.browserRepeats],
		[
			"browser.requestsPerSecond",
			value.browser.requestsPerSecond,
			HARD_CAPS.browserRps,
		],
	];
	for (const [name, actual, maximum] of checks) {
		if (!Number.isFinite(actual) || actual < 0 || actual > maximum) {
			throw new Error(
				`${name} must be between 0 and hard cap ${maximum}; received ${actual}`,
			);
		}
	}
	if (
		value.http.requestsPerSecond === 0 ||
		value.browser.requestsPerSecond === 0
	) {
		throw new Error("requestsPerSecond must be greater than zero");
	}
}

async function crawl(value) {
	const queue = ["/"];
	const visited = new Set();
	const links = [];
	while (queue.length > 0 && visited.size < value.crawl.maxPages) {
		const route = queue.shift();
		if (visited.has(route)) continue;
		visited.add(route);
		try {
			const response = await fetch(new URL(route, value.baseUrl), {
				headers: {
					"user-agent": "Prezly bounded performance benchmark crawler/1.0",
				},
				redirect: "follow",
				signal: AbortSignal.timeout(value.http.timeoutSeconds * 1_000),
			});
			if (
				!response.ok ||
				!response.headers.get("content-type")?.includes("text/html")
			)
				continue;
			const html = await response.text();
			const pageLinks = [
				...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi),
			].map((match) => match[1]);
			links.push(...pageLinks);
			const candidates = selectRoutes(
				value.baseUrl,
				pageLinks,
				value.crawl.maxPages,
				value.crawl.seed,
			);
			for (const candidate of candidates)
				if (!visited.has(candidate)) queue.push(candidate);
		} catch (error) {
			console.error(`Crawl failed for ${route}: ${error.message}`);
		}
		await delay(1_000 / Math.min(value.http.requestsPerSecond, 1));
	}
	return selectRoutes(
		value.baseUrl,
		links,
		value.crawl.routeCount,
		value.crawl.seed,
	);
}

async function runHttp(value, routesToRun) {
	const samples = [];
	for (const route of routesToRun) {
		for (const variant of buildVariants(route)) {
			for (const [phase, repeats] of [
				["cold", value.http.coldRepeats],
				["warmup", value.http.warmupRepeats],
				["warm", value.http.warmRepeats],
			]) {
				for (let repeat = 0; repeat < repeats; repeat += 1) {
					samples.push(await curlSample(value, variant, phase, repeat));
					await delay(1_000 / value.http.requestsPerSecond);
				}
			}
		}
	}
	return samples;
}

async function curlSample(value, variant, phase, repeat) {
	const directory = await mkdtemp(`${tmpdir()}/prezly-benchmark-`);
	const bodyPath = resolve(directory, "body");
	const headerPath = resolve(directory, "headers");
	const url = new URL(variant.route, value.baseUrl).toString();
	const observedAt = new Date().toISOString();
	const curlArgs = [
		"--silent",
		"--show-error",
		"--location",
		"--compressed",
		"--max-time",
		String(value.http.timeoutSeconds),
		"--output",
		bodyPath,
		"--dump-header",
		headerPath,
		"--write-out",
		"%{json}",
		"--user-agent",
		"Prezly bounded performance benchmark/1.0",
	];
	for (const [name, headerValue] of Object.entries(variant.headers))
		curlArgs.push("--header", `${name}: ${headerValue}`);
	curlArgs.push(url);
	try {
		const { stdout } = await execFileAsync("curl", curlArgs, {
			maxBuffer: 2 * 1024 * 1024,
		});
		const metrics = JSON.parse(stdout);
		const headers = parseFinalHeaders(await readFile(headerPath, "utf8"));
		const bodyBytes = (await stat(bodyPath)).size;
		return {
			runner: "curl",
			url,
			route: variant.route,
			variant: variant.kind,
			phase,
			repeat,
			observedAt,
			status: Number(metrics.http_code),
			redirects: Number(metrics.num_redirects),
			redirectUrl: metrics.redirect_url || null,
			dnsMs: secondsToMs(metrics.time_namelookup),
			tcpMs: secondsToMs(
				Number(metrics.time_connect) - Number(metrics.time_namelookup),
			),
			tlsMs: secondsToMs(
				Number(metrics.time_appconnect) - Number(metrics.time_connect),
			),
			ttfbMs: secondsToMs(metrics.time_starttransfer),
			totalMs: secondsToMs(metrics.time_total),
			responseBytes: bodyBytes,
			networkBytes: Number(metrics.size_download),
			contentLength: numberOrNull(headers["content-length"]),
			contentEncoding: headers["content-encoding"] ?? null,
			cache: {
				cfCacheStatus: headers["cf-cache-status"] ?? null,
				age: numberOrNull(headers.age),
				cacheControl: headers["cache-control"] ?? null,
				nextCache: headers["x-nextjs-cache"] ?? null,
				vercelCache: headers["x-vercel-cache"] ?? null,
			},
			replica: Object.fromEntries(
				(value.instrumentation?.replicaHeaders ?? []).map((name) => [
					name,
					headers[name.toLowerCase()] ?? null,
				]),
			),
			error: null,
		};
	} catch (error) {
		return {
			runner: "curl",
			url,
			route: variant.route,
			variant: variant.kind,
			phase,
			repeat,
			observedAt,
			status: 0,
			error: error.message,
		};
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
}

async function runBrowser(value, routesToRun) {
	const { chromium } = await import("@playwright/test");
	const browser = await chromium.launch({ headless: true });
	const samples = [];
	try {
		for (const route of routesToRun) {
			for (let repeat = 0; repeat < value.browser.repeats; repeat += 1) {
				const context = await browser.newContext();
				const page = await context.newPage();
				const waterfall = [];
				page.on("response", async (response) => {
					const request = response.request();
					waterfall.push({
						url: response.url(),
						method: request.method(),
						resourceType: request.resourceType(),
						status: response.status(),
						fromServiceWorker: response.fromServiceWorker(),
						contentLength: numberOrNull(response.headers()["content-length"]),
						timing: request.timing(),
					});
				});
				const url = new URL(route, value.baseUrl).toString();
				const started = performance.now();
				try {
					const response = await page.goto(url, {
						waitUntil: "networkidle",
						timeout: value.browser.timeoutMs,
					});
					const navigation = await page.evaluate(() => {
						const entry = performance.getEntriesByType("navigation")[0];
						return entry ? entry.toJSON() : null;
					});
					let interactionMs = null;
					if (value.instrumentation?.interactionSelector) {
						const locator = page
							.locator(value.instrumentation.interactionSelector)
							.first();
						if (await locator.isVisible()) {
							const interactionStarted = performance.now();
							await locator.click({ timeout: 5_000 });
							interactionMs = performance.now() - interactionStarted;
						}
					}
					const itemMetrics = await inspectItems(
						page,
						value.instrumentation?.listItemSelector,
					);
					samples.push({
						runner: "playwright",
						url,
						route,
						repeat,
						status: response?.status() ?? 0,
						finalUrl: page.url(),
						redirects: countRedirects(response?.request()),
						navigationMs: performance.now() - started,
						domInteractiveMs: navigation?.domInteractive ?? null,
						domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? null,
						loadMs: navigation?.loadEventEnd ?? null,
						transferBytes: navigation?.transferSize ?? null,
						decodedBytes: navigation?.decodedBodySize ?? null,
						interactionMs,
						waterfall,
						...itemMetrics,
						serializedClientPropsBytes: await serializedPropsBytes(page),
						error: null,
					});
				} catch (error) {
					samples.push({
						runner: "playwright",
						url,
						route,
						repeat,
						status: 0,
						waterfall,
						error: error.message,
					});
				} finally {
					await context.close();
				}
				await delay(1_000 / value.browser.requestsPerSecond);
			}
		}
	} finally {
		await browser.close();
	}
	return samples;
}

async function inspectItems(page, selector) {
	if (!selector) return { renderedListItems: null, visibleListItems: null };
	return page.locator(selector).evaluateAll((elements) => ({
		renderedListItems: elements.length,
		visibleListItems: elements.filter((element) => {
			const rect = element.getBoundingClientRect();
			return (
				rect.width > 0 &&
				rect.height > 0 &&
				rect.bottom > 0 &&
				rect.top < window.innerHeight
			);
		}).length,
	}));
}

async function serializedPropsBytes(page) {
	return page.evaluate(() => {
		const script = document.querySelector("#__NEXT_DATA__");
		return script?.textContent
			? new TextEncoder().encode(script.textContent).length
			: null;
	});
}

async function runInvalidation(value, route) {
	const scenario = value.invalidation;
	if (!scenario?.safeFixture || !scenario?.mutationUrl) {
		throw new Error(
			"Invalidation requires invalidation.safeFixture=true and mutationUrl in the profile",
		);
	}
	if (!args.runInvalidation) return null;
	const before = await fetchVariants(value, route);
	const headers = { "content-type": "application/json" };
	if (scenario.authorizationEnv) {
		const secret = process.env[scenario.authorizationEnv];
		if (!secret)
			throw new Error(
				`Missing secret environment variable ${scenario.authorizationEnv}`,
			);
		headers.authorization = `Bearer ${secret}`;
	}
	const mutation = await fetch(scenario.mutationUrl, {
		method: scenario.method ?? "POST",
		headers,
		body: scenario.body ? JSON.stringify(scenario.body) : undefined,
		signal: AbortSignal.timeout(value.http.timeoutSeconds * 1_000),
	});
	if (!mutation.ok)
		throw new Error(
			`Invalidation mutation failed with HTTP ${mutation.status}`,
		);
	const deadline = Date.now() + (scenario.maxWaitSeconds ?? 60) * 1_000;
	let after;
	do {
		await delay((scenario.pollSeconds ?? 5) * 1_000);
		after = await fetchVariants(value, route);
		if (after.every((item, index) => item.hash !== before[index].hash)) {
			return { passed: true, route, before, after };
		}
	} while (Date.now() < deadline);
	return {
		passed: false,
		route,
		before,
		after,
		error: "HTML and RSC did not both change before timeout",
	};
}

async function fetchVariants(value, route) {
	const { createHash } = await import("node:crypto");
	return Promise.all(
		buildVariants(route).map(async (variant) => {
			const response = await fetch(new URL(variant.route, value.baseUrl), {
				headers: variant.headers,
			});
			const body = await response.arrayBuffer();
			return {
				kind: variant.kind,
				status: response.status,
				hash: createHash("sha256").update(Buffer.from(body)).digest("hex"),
			};
		}),
	);
}

function parseFinalHeaders(raw) {
	const blocks = raw
		.trim()
		.split(/\r?\n\r?\n/)
		.filter(Boolean);
	const lines = blocks.at(-1)?.split(/\r?\n/) ?? [];
	return Object.fromEntries(
		lines.slice(1).flatMap((line) => {
			const separator = line.indexOf(":");
			return separator < 0
				? []
				: [
						[
							line.slice(0, separator).trim().toLowerCase(),
							line.slice(separator + 1).trim(),
						],
					];
		}),
	);
}

function summarizeBrowser(samples) {
	const successful = samples.filter(
		({ error, status }) => !error && status < 400,
	);
	return {
		navigations: samples.length,
		successfulNavigations: successful.length,
		errorRate:
			samples.length > 0
				? (samples.length - successful.length) / samples.length
				: 0,
		navigationMs: distribution(
			successful.map(({ navigationMs }) => navigationMs),
		),
		domInteractiveMs: distribution(
			successful
				.map(({ domInteractiveMs }) => domInteractiveMs)
				.filter(Number.isFinite),
		),
		interactionMs: distribution(
			successful
				.map(({ interactionMs }) => interactionMs)
				.filter(Number.isFinite),
		),
		transferBytes: distribution(
			successful
				.map(({ transferBytes }) => transferBytes)
				.filter(Number.isFinite),
		),
		decodedBytes: distribution(
			successful
				.map(({ decodedBytes }) => decodedBytes)
				.filter(Number.isFinite),
		),
	};
}

function summarizeInstrumentation(browser, http, value) {
	const available = (values) =>
		values.some((item) => item !== null && item !== undefined);
	return {
		serializedClientPropsBytes: available(
			browser.map(
				({ serializedClientPropsBytes }) => serializedClientPropsBytes,
			),
		)
			? "available in browser samples"
			: "unavailable",
		renderedAndVisibleListItems: value.instrumentation?.listItemSelector
			? "available in browser samples"
			: "unavailable: no listItemSelector configured",
		redisCacheEntryBytesReadDecodeTime:
			"unavailable: requires server-side telemetry export",
		envoyReplicaPlacement: available(
			http.flatMap(({ replica }) => Object.values(replica ?? {})),
		)
			? "available in HTTP samples"
			: "unavailable: configured headers absent",
	};
}

function renderHumanReport(value) {
	const http = value.summary.http;
	const browser = value.summary.browser;
	const format = (number) =>
		Number.isFinite(number) ? number.toFixed(1) : "n/a";
	const lines = [
		`# Performance benchmark: ${value.metadata.profile}`,
		"",
		`Base: ${value.metadata.baseUrl}`,
		`Routes: ${value.routes.length}`,
		`Location: ${value.metadata.location}`,
		"",
		"## HTTP (curl)",
		"",
		`Requests: ${http.requests} (${http.successfulRequests} successful)`,
		`Error rate: ${format(http.errorRate * 100)}%`,
		`Throughput: ${format(http.requestsPerSecond)} req/s (serial observed throughput)`,
		`DNS / TCP / TLS median: ${format(http.dnsMs.median)} / ${format(http.tcpMs.median)} / ${format(http.tlsMs.median)} ms`,
		`TTFB median / p95: ${format(http.ttfbMs.median)} / ${format(http.ttfbMs.p95)} ms`,
		`Warm TTFB median / p95: ${format(http.warmTtfbMs.median)} / ${format(http.warmTtfbMs.p95)} ms`,
		`Total median / p95: ${format(http.totalMs.median)} / ${format(http.totalMs.p95)} ms`,
		`Response bytes median / p95: ${format(http.responseBytes.median)} / ${format(http.responseBytes.p95)}`,
		`HTML / RSC median bytes: ${format(http.byVariant.html?.responseBytes.median)} / ${format(http.byVariant.rsc?.responseBytes.median)}`,
		`Statuses: ${JSON.stringify(http.statusCounts)}`,
		`CDN states: ${JSON.stringify(Object.fromEntries(Object.entries(http.byCdnCacheStatus).map(([status, summary]) => [status, summary.requests])))}`,
		"",
		"## Browser (Playwright)",
		"",
		`Navigations: ${browser.navigations}`,
		`Error rate: ${format(browser.errorRate * 100)}%`,
		`Navigation median / p95: ${format(browser.navigationMs.median)} / ${format(browser.navigationMs.p95)} ms`,
		`DOM interactive median / p95: ${format(browser.domInteractiveMs.median)} / ${format(browser.domInteractiveMs.p95)} ms`,
		`Interaction median / p95: ${format(browser.interactionMs.median)} / ${format(browser.interactionMs.p95)} ms`,
		"",
		`## Failures (${value.summary.failures.length})`,
		...(value.summary.failures.length
			? value.summary.failures.map(
					(failure) =>
						`- ${failure.runner} ${failure.status}: ${failure.url}${failure.error ? ` — ${failure.error}` : ""}`,
				)
			: ["- None"]),
		"",
		"## Optional instrumentation",
		...Object.entries(value.summary.optionalInstrumentation).map(
			([metric, availability]) => `- ${metric}: ${availability}`,
		),
	];
	if (value.comparison) {
		lines.push(
			"",
			`## Baseline comparison: ${value.comparison.passed ? "PASS" : "FAIL"}`,
		);
		lines.push(
			...(value.comparison.regressions.length
				? value.comparison.regressions.map(
						(item) =>
							`- ${item.metric}: +${item.changePercent.toFixed(1)}% (limit ${item.thresholdPercent}%)`,
					)
				: ["- No threshold regressions"]),
		);
	}
	lines.push("");
	return `${lines.join("\n")}\n`;
}

function sanitizeConfig(value) {
	const copy = structuredClone(value);
	if (copy.invalidation?.authorizationEnv)
		copy.invalidation.authorizationEnv = `<env:${copy.invalidation.authorizationEnv}>`;
	return copy;
}

function secondsToMs(value) {
	return Math.max(0, Number(value) * 1_000);
}
function numberOrNull(value) {
	const number = Number(value);
	return Number.isFinite(number) && value !== null && value !== ""
		? number
		: null;
}
function delay(milliseconds) {
	return new Promise((done) => setTimeout(done, milliseconds));
}
function countRedirects(request) {
	let count = 0;
	for (
		let previous = request?.redirectedFrom();
		previous;
		previous = previous.redirectedFrom()
	)
		count += 1;
	return count;
}
