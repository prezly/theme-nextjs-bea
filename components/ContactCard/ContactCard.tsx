import {
    IconEmail,
    IconFacebook,
    IconGlobe,
    IconMobile,
    IconPhone,
    IconTwitter,
} from '@prezly/icons';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { useDevice } from '@/hooks';

import type { Contact } from './types';
import { getSocialHandles } from './utils';

import styles from './ContactCard.module.scss';

interface Props {
    className?: string;
    contact: Contact;
    isCompact?: boolean;
    renderAvatar: ({ className }: { className: string }) => ReactNode;
}
function ContactCard({ className, contact, isCompact = false, renderAvatar }: Props) {
    const device = useDevice();
    const { name, description, company, email, phone, mobile, website } = contact;
    const { facebook, twitter } = getSocialHandles(contact);
    const subtitle = description && company ? `${description}, ${company}` : description;
    return (
        <div
            id={`contact-${contact.uuid}`}
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
                            <IconEmail width={16} height={16} className={styles.icon} />
                            <span className={styles.linkText}>{email}</span>
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`} className={styles.link}>
                            <IconPhone width={16} height={16} className={styles.icon} />
                            <span className={styles.linkText}>{phone}</span>
                        </a>
                    )}
                    {mobile && (
                        <a href={`tel:${mobile}`} className={styles.link}>
                            <IconMobile width={16} height={16} className={styles.icon} />
                            <span className={styles.linkText}>{mobile}</span>
                        </a>
                    )}
                    {website && (
                        <a href={website} className={styles.link}>
                            <IconGlobe width={16} height={16} className={styles.icon} />
                            <span className={styles.linkText}>{website}</span>
                        </a>
                    )}
                </div>
                <div className={styles.socials}>
                    {facebook && (
                        <a href={`https://facebook.com/${facebook}`} className={styles.link}>
                            <IconFacebook width={16} height={16} className={styles.icon} />
                            <span className={styles.linkText}>{facebook}</span>
                        </a>
                    )}
                    {twitter && (
                        <a href={`https://twitter.com/${twitter}`} className={styles.link}>
                            <IconTwitter width={16} height={16} className={styles.icon} />
                            <span className={styles.linkText}>{`@${twitter}`}</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ContactCard;
