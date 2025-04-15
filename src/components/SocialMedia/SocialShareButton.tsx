'use client';

import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import type { ShareableSocialNetwork } from './types';
import { getSocialShareUrl } from './utils';

import styles from './SocialShareButton.module.scss';

interface ShareButtonProps {
    network: ShareableSocialNetwork;
    url: string;
    className?: string;
}

export function SocialShareButton({
    network,
    url,
    className,
    children,
}: PropsWithChildren<ShareButtonProps>) {
    const shareUrl = getSocialShareUrl(network, url);

    if (!shareUrl) {
        return null;
    }

    function handleClick() {
        window.open(shareUrl, '_blank');
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={network}
            className={classNames(styles.button, className)}
        >
            {children}
        </button>
    );
}
