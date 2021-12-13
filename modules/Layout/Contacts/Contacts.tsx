import { NewsroomContact } from '@prezly/sdk';
import { UploadcareImage } from '@prezly/uploadcare-image';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useMedia } from 'react-use';

import ContactCard from '@/components/ContactCard';

import { getNumberOfColumns } from './lib';

import styles from './Contacts.module.scss';

interface Props {
    contacts: NewsroomContact[];
}

const Contacts: FunctionComponent<Props> = ({ contacts }) => {
    const numberOfColumns = getNumberOfColumns(contacts.length);
    const isTabletViewport = useMedia('(max-width: 768px)');
    const isCompactCard = numberOfColumns === 3 && !isTabletViewport;

    if (contacts.length === 0) {
        return null;
    }

    return (
        <div className={styles.contacts}>
            <div className={styles.container}>
                <h2 className={styles.title}>Contact us</h2>
                <div
                    className={classNames(styles.grid, {
                        [styles.twoColumns]: numberOfColumns === 2,
                        [styles.threeColumns]: numberOfColumns === 3,
                    })}
                >
                    {contacts.map((contact) => (
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
};

export default Contacts;
