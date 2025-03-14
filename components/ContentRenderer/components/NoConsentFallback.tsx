'use client';

import type { EmbedNode } from '@prezly/story-content-format';
import NextLink from 'next/link';

import { Button } from '@/components/Button';
import { IconBan } from '@/icons';
import { useCookieConsent } from '@/modules/CookieConsent';

import styles from './NoConsentFallback.module.scss';

interface Props {
    id: string;
    oembed: EmbedNode['oembed'];
    entity: 'embed' | 'video';
}

export function NoConsentFallback({ id, entity, oembed }: Props) {
    const { updatePreferences } = useCookieConsent();

    if (oembed.screenshot_url) {
        return (
            <NextLink id={id} className={styles.imageFallback} href={oembed.url} target="__blank">
                <img
                    className={styles.image}
                    src={oembed.screenshot_url}
                    alt={oembed.title || oembed.description || ''}
                />
            </NextLink>
        );
    }

    return (
        <div className={styles.container} id={id}>
            <IconBan className={styles.icon} />
            <div className={styles.title}>Content unavailable</div>
            <p className={styles.description}>
                <span>
                    It seems this {entity} couldn&apos;t load due to your cookie preferences.
                </span>
                <span>Please enable all cookies for a seamless experience.</span>
            </p>
            <Button onClick={updatePreferences} variation="secondary">
                Adjust cookie preferences
            </Button>
        </div>
    );
}
