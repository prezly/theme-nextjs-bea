import React, { FunctionComponent } from 'react';

import SocialMedia from '@/components/SocialMedia';
import { useCompanyInformation } from '@/hooks/useCompanyInformation';

import { getWebsiteHostname } from './utils';

import styles from './Boilerplate.module.scss';

const Boilerplate: FunctionComponent = () => {
    const companyInformation = useCompanyInformation();
    if (!companyInformation) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.aboutUs}>
                        <h2 className={styles.heading}>About Us</h2>
                        <div
                            className={styles.about}
                            dangerouslySetInnerHTML={{ __html: companyInformation.about }}
                        />
                        <SocialMedia
                            companyInformation={companyInformation}
                            className={styles.socialMedia}
                        />
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
                    <div className={styles.contacts}>
                        <h2 className={styles.heading}>Contacts</h2>
                        <p>{companyInformation.address}</p>
                        {companyInformation.phone && (
                            <>
                                <div className={styles.separator} />
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
                        {companyInformation.email && (
                            <>
                                <div className={styles.separator} />
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
                </div>
            </div>
        </div>
    );
};

export default Boilerplate;
