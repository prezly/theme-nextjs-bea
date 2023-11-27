import type { Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Boilerplate as Helper, translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/server';
import { SocialMedia } from '@/components/SocialMedia';
import { IconBuilding, IconEmail, IconGlobe, IconPhone } from '@/icons';

import { getWebsiteHostname } from '../utils';

import styles from './Boilerplate.module.scss';

interface Props {
    localeCode: Locale.Code;
    newsroom: Pick<Newsroom, 'display_name'>;
    companyInformation: NewsroomCompanyInformation;
}

export function Boilerplate({ localeCode, newsroom, companyInformation }: Props) {
    const hasAboutInformation = Helper.hasAnyAboutInformation(companyInformation);
    const hasSocialMedia = Helper.hasAnySocialMedia(companyInformation);
    const hasContactInformation = Helper.hasAnyContactInformation(companyInformation);
    const hasAddress = Boolean(companyInformation.address);
    const hasPhone = Boolean(companyInformation.phone);
    const hasEmail = Boolean(companyInformation.email);

    if (!hasAboutInformation && !hasContactInformation) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.columns}>
                    {hasAboutInformation && (
                        <div className={styles.aboutUs}>
                            <h2 className={styles.heading}>
                                <FormattedMessage
                                    locale={localeCode}
                                    for={translations.boilerplate.title}
                                    values={{
                                        companyName:
                                            companyInformation.name || newsroom.display_name,
                                    }}
                                />
                            </h2>
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
                        </div>
                    )}
                    {hasContactInformation && (
                        <div className={styles.contacts}>
                            <h2 className={styles.heading}>
                                <FormattedMessage
                                    locale={localeCode}
                                    for={translations.boilerplate.contact}
                                />
                            </h2>
                            {hasAddress && (
                                <p className={styles.contact}>
                                    <IconBuilding width={16} height={16} className={styles.icon} />
                                    {companyInformation.address}
                                </p>
                            )}
                            {hasPhone && (
                                <p className={styles.contact}>
                                    <IconPhone width={16} height={16} className={styles.icon} />
                                    <a
                                        className={styles.link}
                                        href={`tel:${companyInformation.phone}`}
                                    >
                                        {companyInformation.phone}
                                    </a>
                                </p>
                            )}
                            {hasEmail && (
                                <p className={styles.contact}>
                                    <IconEmail width={16} height={16} className={styles.icon} />
                                    <a
                                        className={styles.link}
                                        href={`mailto:${companyInformation.email}`}
                                    >
                                        {companyInformation.email}
                                    </a>
                                </p>
                            )}
                            {companyInformation.website && (
                                <p className={styles.contact}>
                                    <IconGlobe width={16} height={16} className={styles.icon} />
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
                </div>
            </div>
        </div>
    );
}
