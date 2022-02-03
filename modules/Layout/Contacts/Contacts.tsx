import type { NewsroomContact } from '@prezly/sdk';
import { useCurrentLocale } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { UploadcareImage } from '@prezly/uploadcare-image';
import classNames from 'classnames';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { ContactCard } from '@/components';
import { useDevice } from '@/hooks';

import { getNumberOfColumns } from './lib';

import styles from './Contacts.module.scss';

interface Props {
    contacts: NewsroomContact[];
}

function Contacts({ contacts }: Props) {
    const currentLocale = useCurrentLocale();
    const device = useDevice();
    const contactsInCurrentLocale = useMemo(
        () =>
            contacts.filter((contact) => {
                const localeCodes = contact.display_locales.map((locale) => locale.code);
                return localeCodes.includes(currentLocale.toUnderscoreCode());
            }),
        [contacts, currentLocale],
    );

    const numberOfColumns = getNumberOfColumns(contactsInCurrentLocale.length);
    const isCompactCard = numberOfColumns === 3 && !device.isTablet;

    if (contactsInCurrentLocale.length === 0) {
        return null;
    }

    return (
        <div className={styles.contacts}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    <FormattedMessage {...translations.contacts.title} />
                </h2>
                <div
                    className={classNames(styles.grid, {
                        [styles.twoColumns]: numberOfColumns === 2,
                        [styles.threeColumns]: numberOfColumns === 3,
                    })}
                >
                    {contactsInCurrentLocale.map((contact) => (
                        <ContactCard
                            key={contact.uuid}
                            contact={contact}
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Contacts;
