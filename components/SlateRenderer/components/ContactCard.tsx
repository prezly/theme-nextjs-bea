import type { ContactNode } from '@prezly/story-content-format';
import React from 'react';

import { ContactCard as BaseContactCard } from '@/components';

import styles from '../SlateRenderer.module.scss';

interface Props {
    node: ContactNode;
}

export function ContactCard({ node }: Props) {
    return (
        <BaseContactCard
            className={styles.contactCard}
            contact={node.contact}
            renderAvatar={({ className }) =>
                node.contact.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        className={className}
                        src={node.contact.avatar_url}
                        alt={node.contact.name}
                    />
                )
            }
        />
    );
}
