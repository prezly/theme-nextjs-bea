/* eslint-disable @next/next/no-img-element */

'use client';

import type { EmbedNode } from '@prezly/story-content-format';
import NextLink from 'next/link';

import { Button } from '@/components/Button';
import { IconBan } from '@/icons';
import { useCookieConsent } from '@/modules/CookieConsent/CookieConsentContext';

import styles from './EmbedFallback.module.scss';

interface Props {
    node: EmbedNode;
}

export function EmbedFallback({ node }: Props) {
    const { updatePreferences } = useCookieConsent();

    if (node.oembed.screenshot_url) {
        return (
            <NextLink className={styles.imageFallback} href={node.url} target="__blank">
                <img
                    src={node.oembed.screenshot_url}
                    alt={node.oembed.title || node.oembed.description || ''}
                />
            </NextLink>
        );
    }

    return (
        <div className={styles.container}>
            <IconBan className={styles.icon} />
            <div className={styles.title}>Content unavailable</div>
            <p className={styles.description}>
                <span>It seems this embed couldn't load due to your cookie preferences.</span>
                <span>Please enable all cookies for a seamless experience.</span>
            </p>
            <Button onClick={updatePreferences} variation="secondary">
                Adjust cookie preferences
            </Button>
        </div>
    );
}
