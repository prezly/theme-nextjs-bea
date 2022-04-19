import type { ContactNode } from '@prezly/slate-types';
import React from 'react';

import { ContactCard as ContactCardComponent } from '@/components';

import styles from '../SlateRenderer.module.scss';

interface ContactCardComponentProps {
    node: ContactNode;
}

export function ContactCard({ node }: ContactCardComponentProps) {
    return (
        <ContactCardComponent
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
