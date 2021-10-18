import React, { FunctionComponent } from 'react';

import SocialMedia from '@/components/SocialMedia';
import { useCompanyInformation } from '@/hooks/useCompanyInformation';

import {
    getWebsiteHostname,
    hasAnyAboutInformation,
    hasAnyContactInformation,
    hasAnySocialMedia,
} from './utils';

import styles from './Boilerplate.module.scss';

const Boilerplate: FunctionComponent = () => {
    const companyInformation = useCompanyInformation();
    if (!companyInformation) {
        return null;
    }

    const hasAboutInformation = hasAnyAboutInformation(companyInformation);
    const hasSocialMedia = hasAnySocialMedia(companyInformation);
    const hasContactInformation = hasAnyContactInformation(companyInformation);
    const hasAddress = Boolean(companyInformation.address);
    const hasPhone = Boolean(companyInformation.phone);
    const hasEmail = Boolean(companyInformation.email);

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.columns}>
                    {hasAboutInformation && (
                        <div className={styles.aboutUs}>
                            <h2 className={styles.heading}>About Us</h2>
                            {companyInformation.about && (
                                <div
                                    className={styles.about}
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{ __html: companyInformation.about }}
                                />
                            )}
                            {hasSocialMedia && (
                                <SocialMedia
                                    companyInformation={companyInformation}
                                    className={styles.socialMedia}
                                />
                            )}
                            {companyInformation.website && (
                                <p>
                                    <a
                                        href={companyInformation.website}
                                        className={styles.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {getWebsiteHostname(companyInformation.website)}
                                    </a>
                                </p>
                            )}
                        </div>
                    )}
                    {hasContactInformation && (
                        <div className={styles.contacts}>
                            <h2 className={styles.heading}>Contacts</h2>
                            {hasAddress && <p>{companyInformation.address}</p>}
                            {hasPhone && (
                                <>
                                    {hasAddress && <div className={styles.separator} />}
                                    <p>
                                        <a
                                            className={styles.link}
                                            href={`tel:${companyInformation.phone}`}
                                        >
                                            {companyInformation.phone}
                                        </a>
                                    </p>
                                </>
                            )}
                            {hasEmail && (
                                <>
                                    {(hasAddress || hasPhone) && (
                                        <div className={styles.separator} />
                                    )}
                                    <p>
                                        <a
                                            className={styles.link}
                                            href={`mailto:${companyInformation.email}`}
                                        >
                                            {companyInformation.email}
                                        </a>
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Boilerplate;
