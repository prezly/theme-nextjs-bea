import assert from "node:assert/strict";
import test from "node:test";

import {
	buildVariants,
	compareReports,
	percentile,
	selectRoutes,
	summarizeHttp,
} from "../scripts/performance/lib.mjs";

test("selectRoutes keeps same-origin pages, removes noise, and is stable for a seed", () => {
	const links = [
		"https://example.com/story-b",
		"/story-a#comments",
		"/story-a?utm_source=test",
		"mailto:hello@example.com",
		"https://other.example/story-c",
		"/assets/logo.png",
		"/feed.xml?category=news",
	];

	assert.deepEqual(selectRoutes("https://example.com", links, 5, 42), [
		"/story-a",
		"/story-b",
	]);
});

test("percentile uses the nearest-rank value", () => {
	assert.equal(percentile([10, 20, 30, 40], 0.5), 20);
	assert.equal(percentile([10, 20, 30, 40], 0.95), 40);
	assert.equal(percentile([], 0.95), null);
});

test("buildVariants adds an RSC request without changing the configured route", () => {
	assert.deepEqual(buildVariants("/stories?page=2"), [
		{ kind: "html", route: "/stories?page=2", headers: {} },
		{
			kind: "rsc",
			route: "/stories?page=2&_rsc=benchmark",
			headers: { RSC: "1", "Next-Router-Prefetch": "1" },
		},
	]);
});

test("compareReports flags payload and warm TTFB regressions and includes failures", () => {
	const baseline = {
		summary: {
			http: {
				warmTtfbMs: { p95: 100 },
				responseBytes: { median: 1_000 },
			},
			browser: { navigationMs: { p95: 1_000 } },
		},
	};
	const current = {
		summary: {
			http: {
				warmTtfbMs: { p95: 126 },
				responseBytes: { median: 1_101 },
			},
			browser: { navigationMs: { p95: 1_300 } },
			failures: [{ url: "https://example.com/broken", status: 500 }],
		},
	};

	const comparison = compareReports(current, baseline, {
		warmTtfbP95Percent: 20,
		responseBytesMedianPercent: 10,
		browserNavigationP95Percent: 20,
	});

	assert.equal(comparison.passed, false);
	assert.deepEqual(
		comparison.regressions.map(({ metric }) => metric),
		[
			"http.warmTtfbMs.p95",
			"http.responseBytes.median",
			"browser.navigationMs.p95",
		],
	);
	assert.equal(comparison.failures.length, 1);
});

test("summarizeHttp separates variants, CDN states, and replicas", () => {
	const samples = [
		{
			status: 200,
			phase: "warm",
			variant: "html",
			ttfbMs: 20,
			totalMs: 30,
			dnsMs: 1,
			tcpMs: 2,
			tlsMs: 3,
			responseBytes: 100,
			cache: { cfCacheStatus: "HIT" },
			replica: { "x-served-by": "edge-a" },
		},
		{
			status: 200,
			phase: "warm",
			variant: "rsc",
			ttfbMs: 40,
			totalMs: 50,
			dnsMs: 1,
			tcpMs: 2,
			tlsMs: 3,
			responseBytes: 50,
			cache: { cfCacheStatus: "MISS" },
			replica: { "x-served-by": "edge-b" },
		},
	];

	const summary = summarizeHttp(samples);

	assert.equal(summary.byVariant.html.responseBytes.median, 100);
	assert.equal(summary.byVariant.rsc.responseBytes.median, 50);
	assert.equal(summary.byCdnCacheStatus.HIT.ttfbMs.median, 20);
	assert.equal(summary.byCdnCacheStatus.MISS.ttfbMs.median, 40);
	assert.equal(summary.byReplica["x-served-by=edge-a"].requests, 1);
});
