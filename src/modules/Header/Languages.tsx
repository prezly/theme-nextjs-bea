import { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app, routing } from '@/adapters/server';
import { MarketsPanel, type Market } from '@/modules/Header/ui/MarketsPanel';
import type { NewsroomWithHubLayout } from '@/types';

import * as ui from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    localeCode: Locale.Code;
    memberNewsrooms: Newsroom[];
}

export async function Languages({ localeCode, memberNewsrooms }: Props) {
    const newsroom = (await app().newsroom()) as NewsroomWithHubLayout;
    const languages = await app().languages();
    const { generateUrl } = await routing();

    if (newsroom.hub_layout !== 'market_dropdown') {
        const homepages: ui.Languages.Option[] = languages.map((lang) => ({
            code: lang.code,
            href: generateUrl('index', { localeCode: lang.code }),
            title: lang.locale.native_name,
            stories: newsroom.is_hub ? lang.hub_public_stories_count : lang.public_stories_count,
        }));

        return (
            <ui.Languages
                selected={localeCode}
                options={homepages}
                buttonClassName={styles.navigationButton}
                navigationItemClassName={styles.navigationItem}
            />
        );
    }

    // market_dropdown: one market per newsroom in the hub, current site first.
    // Peers come from one of two sources depending on context:
    // - on the hub root, memberNewsrooms holds the full Newsroom objects (fetched by Header.tsx)
    // - on a member site, newsroom.hub exposes the lighter HubPeer siblings + parent
    const candidates: Array<Newsroom | Newsroom.HubPeer> = newsroom.is_hub
        ? memberNewsrooms
        : [...(newsroom.hub?.siblings ?? []), newsroom.hub?.parent].filter(
              (peer): peer is Newsroom.HubPeer => Boolean(peer),
          );

    // Skip inactive newsrooms — they aren't live, so linking to them is a dead end.
    const peers: Peer[] = candidates.filter((peer) => Newsroom.isActive(peer)).map(toPeer);

    // Use the newsroom name translated to the current locale (company_information.name),
    // not the default display_name — e.g. "Belgium" on the English site, "België" in Dutch.
    const currentNewsroomName =
        languages.find((lang) => lang.code === localeCode)?.company_information.name ||
        newsroom.display_name ||
        newsroom.name;

    // Brand prefix shared across every newsroom in the hub (current + peers), stripped
    // from each label so country names read cleanly (e.g. "Acme UK" -> "UK").
    const sharedPrefix = computeSharedPrefix([
        currentNewsroomName,
        ...peers.map((peer) => peer.name),
    ]);

    const currentMarket: Market = {
        countryName: stripPrefix(currentNewsroomName, sharedPrefix),
        newsroomUuid: newsroom.uuid,
        isCurrent: true,
        languages: languages
            // In market_dropdown mode the hub root renders the regular Stories module,
            // so gate on public_stories_count (root only) — hub_public_stories_count
            // would include member stories and could surface a language whose root
            // homepage is empty.
            .filter((lang) => lang.code === localeCode || lang.public_stories_count > 0)
            .map((lang) => ({
                code: lang.code,
                title: stripCountrySuffix(lang.locale.native_name),
                href: generateUrl('index', { localeCode: lang.code }),
            })),
    };

    const peerMarkets: Market[] = peers
        .map(
            (peer): Market => ({
                countryName: stripPrefix(peer.name, sharedPrefix),
                newsroomUuid: peer.uuid,
                isCurrent: false,
                languages: peer.cultures.map((culture) => ({
                    code: culture.code,
                    title: stripCountrySuffix(culture.native_name),
                    href: `https://${peer.domain}/${cultureToSlug(culture.code)}`,
                })),
            }),
        )
        .sort((a, b) => a.countryName.localeCompare(b.countryName));

    const markets = [currentMarket, ...peerMarkets];

    const totalOptions = markets.reduce((acc, market) => acc + market.languages.length, 0);
    if (totalOptions <= 1) {
        return null;
    }

    return (
        <MarketsPanel
            selected={localeCode}
            markets={markets}
            buttonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
        />
    );
}

interface Peer {
    uuid: string;
    name: string;
    domain: string;
    cultures: ReadonlyArray<{ code: string; native_name: string }>;
}

function toPeer(newsroom: Newsroom | Newsroom.HubPeer): Peer {
    return {
        uuid: newsroom.uuid,
        name: newsroom.display_name || newsroom.name,
        domain: newsroom.domain,
        cultures: newsroom.cultures,
    };
}

function stripCountrySuffix(name: string): string {
    return name.replace(/\s*\([^)]*\)\s*$/, '');
}

function cultureToSlug(code: string): string {
    return code.replace('_', '-').toLowerCase();
}

// Longest common prefix across the hub's newsroom names, trimmed back to the last
// word boundary so we never cut a label mid-word. Used to drop a shared brand prefix.
function computeSharedPrefix(names: string[]): string {
    if (names.length <= 1) {
        return '';
    }

    let prefix = names[0];
    for (const name of names.slice(1)) {
        while (prefix && !name.startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
        }
        if (!prefix) {
            return '';
        }
    }

    const lastSpace = prefix.lastIndexOf(' ');
    return lastSpace === -1 ? '' : prefix.slice(0, lastSpace + 1);
}

function stripPrefix(name: string, prefix: string): string {
    if (!prefix || !name.startsWith(prefix)) {
        return name;
    }

    const remainder = name.slice(prefix.length).trim();
    return remainder || name;
}
