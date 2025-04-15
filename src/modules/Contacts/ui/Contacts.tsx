'use client';

import type { NewsroomContact } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { ContactCard } from '@/components/ContactCard';
import { useDevice } from '@/hooks';
import { getUploadcareImage } from '@/utils';

import { getNumberOfColumns } from '../lib';

import styles from './Contacts.module.scss';

interface Props {
    contacts: NewsroomContact[];
}

export function Contacts({ contacts }: Props) {
    const device = useDevice();
    const locale = useLocale();

    const numberOfColumns = getNumberOfColumns(contacts.length);
    const isCompactCard = numberOfColumns === 3 && !device.isTablet;

    return (
        <div className={styles.contacts}>
            <h2 className={styles.title}>
                <FormattedMessage locale={locale} for={translations.contacts.title} />
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
                        renderAvatar={({ className }) => {
                            const image = getUploadcareImage(contact.avatar_image);

                            return (
                                image && (
                                    <UploadcareImage
                                        className={className}
                                        src={image.cdnUrl}
                                        width={60}
                                        height={60}
                                        alt={contact.name}
                                    />
                                )
                            );
                        }}
                        uuid={contact.uuid}
                    />
                ))}
            </div>
        </div>
    );
}
