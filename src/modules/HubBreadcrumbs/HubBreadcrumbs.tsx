import { app } from '@/adapters/server';
import { environment } from '@/adapters/server';

import styles from './HubBreadcrumbs.module.scss';

/**
 * Renders a breadcrumb trail based on the HUB ancestry configured via
 * `PREZLY_HUB_ANCESTRY` — a comma-separated list of parent hub UUIDs from
 * outermost to innermost, e.g.:
 *
 *   PREZLY_HUB_ANCESTRY=uuid-root-hub,uuid-regional-hub
 *
 * Hub names and URLs are fetched at runtime from the Prezly API so they
 * always reflect the current values in the dashboard.
 *
 * The component renders nothing when `PREZLY_HUB_ANCESTRY` is not set,
 * making it safe to include in the layout of all deployments.
 */
export async function HubBreadcrumbs() {
    const env = environment();
    const ancestryRaw = env.PREZLY_HUB_ANCESTRY;

    if (!ancestryRaw) return null;

    const uuids = ancestryRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    if (uuids.length === 0) return null;

    const [currentNewsroom, ancestors] = await Promise.all([
        app().newsroom(),
        Promise.all(
            uuids.map((uuid) =>
                app()
                    .client.newsrooms.get(uuid)
                    .catch(() => null),
            ),
        ),
    ]);

    const validAncestors = ancestors.filter(Boolean);

    if (validAncestors.length === 0) return null;

    const segments = [
        ...validAncestors.map((n) => ({
            name: n!.display_name || n!.name,
            url: n!.url,
        })),
        {
            name: currentNewsroom.display_name || currentNewsroom.name,
            url: null,
        },
    ];

    return (
        <nav className={styles.breadcrumbs} aria-label="Hub navigation">
            <ol className={styles.list}>
                {segments.map((seg, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={i} className={styles.item}>
                        {i > 0 && (
                            <span className={styles.separator} aria-hidden="true">
                                /
                            </span>
                        )}
                        {seg.url ? (
                            <a href={seg.url} className={styles.link}>
                                {seg.name}
                            </a>
                        ) : (
                            <span className={styles.current} aria-current="page">
                                {seg.name}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
