import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app, routing } from '@/adapters/server';
import { MarketsPanel, type Market } from '@/modules/Header/ui/MarketsPanel';

import * as ui from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    localeCode: Locale.Code;
    memberNewsrooms: Newsroom[];
}

export async function Languages({ localeCode, memberNewsrooms }: Props) {
    const newsroom = await app().newsroom();
    const languages = await app().languages();
    const settings = await app().themeSettings();
    const { generateUrl } = await routing();

    if (settings.hub_layout !== 'market_dropdown') {
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
    const peers: Peer[] = newsroom.is_hub
        ? memberNewsrooms.map(toPeer)
        : [...(newsroom.hub?.siblings ?? []), newsroom.hub?.parent]
              .filter((peer): peer is Newsroom.HubPeer => Boolean(peer))
              .map(toPeer);

    // Brand prefix shared across every newsroom in the hub (current + peers), stripped
    // from each label so country names read cleanly (e.g. "Acme UK" -> "UK").
    const sharedPrefix = computeSharedPrefix([
        newsroom.display_name || newsroom.name,
        ...peers.map((peer) => peer.name),
    ]);

    const currentMarket: Market = {
        countryName: stripPrefix(newsroom.display_name || newsroom.name, sharedPrefix),
        newsroomUuid: newsroom.uuid,
        isCurrent: true,
        languages: languages
            .filter(
                (lang) =>
                    lang.code === localeCode ||
                    (newsroom.is_hub
                        ? lang.hub_public_stories_count > 0
                        : lang.public_stories_count > 0),
            )
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
