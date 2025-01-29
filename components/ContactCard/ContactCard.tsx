'use client';

import type { ContactNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { useDevice } from '@/hooks';
import { IconEmail, IconFacebook, IconGlobe, IconMobile, IconPhone, IconTwitter } from '@/icons';

import type { ContactInfo } from './types';
import { getSocialHandles } from './utils';

import styles from './ContactCard.module.scss';

interface Props {
    className?: string;
    contactInfo: ContactInfo;
    isCompact?: boolean;
    renderAvatar: ({ className }: { className: string }) => ReactNode;
    uuid: ContactNode['uuid'];
}
export function ContactCard({
    className,
    contactInfo,
    isCompact = false,
    renderAvatar,
    uuid,
}: Props) {
    const device = useDevice();
    const { name, description, company, email, phone, mobile, website } = contactInfo;
    const { facebook, twitter } = getSocialHandles(contactInfo);
    const subtitle = description && company ? `${description}, ${company}` : description || company;
    return (
        <div
            id={`contact-${uuid}`}
            className={classNames(styles.container, className, {
                [styles.compact]: isCompact || device.isMobile,
            })}
        >
            <div className={styles.contentTitle}>
                {renderAvatar({ className: styles.avatar })}
                <div>
                    <h4 className={styles.name}>{name}</h4>
                    {subtitle && <h5 className={styles.position}>{subtitle}</h5>}
                </div>
            </div>
            <div className={styles.links}>
                <div className={styles.primaryContacts}>
                    {email && (
                        <a href={`mailto:${email}`} className={styles.link}>
                            <IconEmail className={styles.icon} />
                            <span className={styles.linkText}>{email}</span>
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`} className={styles.link}>
                            <IconPhone className={styles.icon} />
                            <span className={styles.linkText}>{phone}</span>
                        </a>
                    )}
                    {mobile && (
                        <a href={`tel:${mobile}`} className={styles.link}>
                            <IconMobile className={styles.icon} />
                            <span className={styles.linkText}>{mobile}</span>
                        </a>
                    )}
                    {website && (
                        <a href={website} className={styles.link}>
                            <IconGlobe className={styles.icon} />
                            <span className={styles.linkText}>
                                {website.replace(/(^\w+:|^)\/\//, '')}
                            </span>
                        </a>
                    )}
                </div>
                <div className={styles.socials}>
                    {facebook && (
                        <a href={`https://facebook.com/${facebook}`} className={styles.link}>
                            <IconFacebook className={styles.icon} />
                            <span className={styles.linkText}>{facebook}</span>
                        </a>
                    )}
                    {twitter && (
                        <a href={`https://twitter.com/${twitter}`} className={styles.link}>
                            <IconTwitter className={styles.icon} />
                            <span className={styles.linkText}>{`@${twitter}`}</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
