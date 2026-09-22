import { createHash } from "node:crypto";

const ASSET_EXTENSION =
	/\.(?:avif|css|gif|ico|jpe?g|js|json|map|pdf|png|svg|webp|woff2?|xml)(?:$|\?)/i;
const TRACKING_PARAMETER = /^(?:utm_.+|fbclid|gclid)$/i;

export function percentile(values, fraction) {
	if (values.length === 0) {
		return null;
	}
	const sorted = [...values].sort((left, right) => left - right);
	return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)];
}

export function distribution(values) {
	return {
		count: values.length,
		median: percentile(values, 0.5),
		p95: percentile(values, 0.95),
		min: values.length === 0 ? null : Math.min(...values),
		max: values.length === 0 ? null : Math.max(...values),
	};
}

export function selectRoutes(baseUrl, links, limit, seed) {
	const base = new URL(baseUrl);
	const routes = new Set();

	for (const link of links) {
		try {
			const url = new URL(link, base);
			if (
				!["http:", "https:"].includes(url.protocol) ||
				url.origin !== base.origin
			) {
				continue;
			}
			if (ASSET_EXTENSION.test(url.pathname)) {
				continue;
			}
			url.hash = "";
			for (const key of [...url.searchParams.keys()]) {
				if (TRACKING_PARAMETER.test(key)) {
					url.searchParams.delete(key);
				}
			}
			routes.add(`${url.pathname}${url.search}`);
		} catch {
			// Ignore malformed links discovered in HTML.
		}
	}

	return [...routes]
		.sort((left, right) => {
			const leftHash = createHash("sha256")
				.update(`${seed}:${left}`)
				.digest("hex");
			const rightHash = createHash("sha256")
				.update(`${seed}:${right}`)
				.digest("hex");
			return leftHash.localeCompare(rightHash);
		})
		.slice(0, limit)
		.sort();
}

export function buildVariants(route) {
	const separator = route.includes("?") ? "&" : "?";
	return [
		{ kind: "html", route, headers: {} },
		{
			kind: "rsc",
			route: `${route}${separator}_rsc=benchmark`,
			headers: { RSC: "1", "Next-Router-Prefetch": "1" },
		},
	];
}

function regression(metric, current, baseline, thresholdPercent) {
	if (
		!Number.isFinite(current) ||
		!Number.isFinite(baseline) ||
		baseline === 0
	) {
		return null;
	}
	const changePercent = ((current - baseline) / baseline) * 100;
	return changePercent > thresholdPercent
		? { metric, current, baseline, changePercent, thresholdPercent }
		: null;
}

export function compareReports(current, baseline, thresholds) {
	const regressions = [
		regression(
			"http.warmTtfbMs.p95",
			current.summary.http.warmTtfbMs.p95,
			baseline.summary.http.warmTtfbMs.p95,
			thresholds.warmTtfbP95Percent,
		),
		regression(
			"http.responseBytes.median",
			current.summary.http.responseBytes.median,
			baseline.summary.http.responseBytes.median,
			thresholds.responseBytesMedianPercent,
		),
		regression(
			"browser.navigationMs.p95",
			current.summary.browser?.navigationMs.p95,
			baseline.summary.browser?.navigationMs.p95,
			thresholds.browserNavigationP95Percent,
		),
	].filter(Boolean);
	const failures = current.summary.failures ?? [];

	return {
		passed: regressions.length === 0 && failures.length === 0,
		regressions,
		failures,
	};
}

export function summarizeHttp(samples) {
	const successful = samples.filter(
		({ error, status }) => !error && status < 400,
	);
	const warm = successful.filter(({ phase }) => phase === "warm");
	const firstStarted = Date.parse(samples[0]?.observedAt);
	const last = samples.at(-1);
	const elapsedSeconds =
		Number.isFinite(firstStarted) && last
			? (Date.parse(last.observedAt) - firstStarted + (last.totalMs ?? 0)) /
				1_000
			: samples.reduce((sum, sample) => sum + (sample.totalMs ?? 0), 0) / 1_000;

	return {
		requests: samples.length,
		successfulRequests: successful.length,
		errorRate:
			samples.length > 0
				? (samples.length - successful.length) / samples.length
				: 0,
		requestsPerSecond:
			elapsedSeconds > 0 ? samples.length / elapsedSeconds : null,
		statusCounts: Object.fromEntries(
			[...new Set(samples.map(({ status }) => String(status ?? "error")))].map(
				(status) => [
					status,
					samples.filter(
						(sample) => String(sample.status ?? "error") === status,
					).length,
				],
			),
		),
		dnsMs: distribution(successful.map(({ dnsMs }) => dnsMs)),
		tcpMs: distribution(successful.map(({ tcpMs }) => tcpMs)),
		tlsMs: distribution(successful.map(({ tlsMs }) => tlsMs)),
		ttfbMs: distribution(successful.map(({ ttfbMs }) => ttfbMs)),
		totalMs: distribution(successful.map(({ totalMs }) => totalMs)),
		warmTtfbMs: distribution(warm.map(({ ttfbMs }) => ttfbMs)),
		responseBytes: distribution(
			successful.map(({ responseBytes }) => responseBytes),
		),
		byVariant: groupSummaries(
			successful,
			({ variant }) => variant ?? "unknown",
		),
		byCdnCacheStatus: groupSummaries(
			successful,
			({ cache }) =>
				cache?.cfCacheStatus ?? cache?.vercelCache ?? "unavailable",
		),
		byReplica: groupSummaries(
			successful.flatMap((sample) =>
				Object.entries(sample.replica ?? {})
					.filter(([, value]) => value)
					.map(([name, value]) => ({
						...sample,
						replicaKey: `${name}=${value}`,
					})),
			),
			({ replicaKey }) => replicaKey,
		),
	};
}

function groupSummaries(samples, keyFor) {
	const groups = new Map();
	for (const sample of samples) {
		const key = keyFor(sample);
		groups.set(key, [...(groups.get(key) ?? []), sample]);
	}
	return Object.fromEntries(
		[...groups].map(([key, group]) => [
			key,
			{
				requests: group.length,
				ttfbMs: distribution(group.map(({ ttfbMs }) => ttfbMs)),
				totalMs: distribution(group.map(({ totalMs }) => totalMs)),
				responseBytes: distribution(
					group.map(({ responseBytes }) => responseBytes),
				),
			},
		]),
	);
}
