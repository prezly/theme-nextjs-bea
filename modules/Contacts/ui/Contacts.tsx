'use client';

import type { NewsroomContact } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';
import { UploadcareImage } from '@prezly/uploadcare-image';
import classNames from 'classnames';

import { ContactCard } from '@/components/ContactCard';
import { useDevice } from '@/hooks';
import { FormattedMessage } from '@/theme/client';

import { getNumberOfColumns } from '../lib';

import styles from './Contacts.module.scss';

interface Props {
    contacts: NewsroomContact[];
}

export function Contacts({ contacts }: Props) {
    const device = useDevice();

    const numberOfColumns = getNumberOfColumns(contacts.length);
    const isCompactCard = numberOfColumns === 3 && !device.isTablet;

    return (
        <div className={styles.contacts}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    <FormattedMessage for={translations.contacts.title} />
                </h2>
                <div
                    className={classNames(styles.grid, {
                        [styles.twoColumns]: numberOfColumns === 2,
                        [styles.threeColumns]: numberOfColumns === 3,
                    })}
                >
                    {contacts.map((contact) => (
                        <ContactCard
                            key={contact.uuid}
                            contactInfo={{
                                name: contact.name ?? '',
                                company: contact.company ?? '',
                                description: contact.description ?? '',
                                email: contact.email ?? '',
                                website: contact.website ?? '',
                                mobile: contact.mobile ?? '',
                                phone: contact.phone ?? '',
                                facebook: contact.facebook ?? '',
                                twitter: contact.twitter ?? '',
                            }}
                            isCompact={isCompactCard}
                            renderAvatar={({ className }) =>
                                contact.avatar_image && (
                                    <UploadcareImage
                                        layout="fixed"
                                        imageDetails={contact.avatar_image}
                                        className={className}
                                    />
                                )
                            }
                            uuid={contact.uuid}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
