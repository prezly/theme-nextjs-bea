'use client';

import type { Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import { Boilerplate as Helper, translations, useIntl } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { SocialMedia } from '@/components/SocialMedia';
import { PREVIEW } from '@/events';
import { IconBuilding, IconEmail, IconExternalLink, IconGlobe, IconPhone } from '@/icons';
import { analytics, isPreviewActive } from '@/utils';

import { getWebsiteHostname } from '../utils';

import styles from './Boilerplate.module.scss';

interface Props {
    newsroom: Pick<Newsroom, 'display_name' | 'url' | 'uuid'>;
    companyInformation: NewsroomCompanyInformation;
}

export function Boilerplate({ newsroom, companyInformation }: Props) {
    const { formatMessage } = useIntl();
    const isPreview = isPreviewActive();
    const siteInfoSettingsUrl = `https://rock.prezly.com/sites/${newsroom.uuid}/settings/information`;

    const hasAboutInformation = Helper.hasAnyAboutInformation(companyInformation);
    const hasSocialMedia = Helper.hasAnySocialMedia(companyInformation);
    const hasContactInformation = Helper.hasAnyContactInformation(companyInformation);
    const hasAddress = Boolean(companyInformation.address);
    const hasPhone = Boolean(companyInformation.phone);
    const hasEmail = Boolean(companyInformation.email);

    if (!hasAboutInformation && !hasContactInformation && !isPreview) {
        return null;
    }

    return (
        <section className={styles.container}>
            <div className={classNames('container', { [styles.preview]: isPreview })}>
                <div className={styles.columns}>
                    {(hasAboutInformation || isPreview) && (
                        <section aria-labelledby="boilerplate-about-us" className={styles.aboutUs}>
                            {/** biome-ignore lint/correctness/useUniqueElementIds: <Boilerplate is rendered once. It's safe to have a static id> */}
                            <h2
                                id="boilerplate-about-us"
                                className={classNames(styles.heading, {
                                    [styles.preview]: isPreview && !companyInformation.name,
                                })}
                            >
                                {formatMessage(translations.boilerplate.title, {
                                    companyName: companyInformation.name || newsroom.display_name,
                                })}
                            </h2>
                            {companyInformation.about && (
                                <div
                                    className={styles.about}
                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <...>
                                    dangerouslySetInnerHTML={{ __html: companyInformation.about }}
                                />
                            )}
                            {!companyInformation.about && isPreview && (
                                <div className={classNames(styles.about, styles.preview)}>
                                    This is your about section. Here you can tell people who you
                                    are, how your brand began, and what you believe in. Share the
                                    story behind your work, the values that guide you, and what
                                    makes your approach unique. You can highlight important points
                                    with bold text or include links to other pages or projects.
                                </div>
                            )}
                            {(hasSocialMedia || isPreview) && (
                                <SocialMedia
                                    companyInformation={companyInformation}
                                    className={styles.socialMedia}
                                    isPreview={isPreview}
                                />
                            )}
                        </section>
                    )}
                    {(hasContactInformation || isPreview) && (
                        <section aria-labelledby="boilerplate-contacts" className={styles.contacts}>
                            {/** biome-ignore lint/correctness/useUniqueElementIds: <Boilerplate is rendered once. It's safe to have a static id> */}
                            <h2 id="boilerplate-contacts" className={styles.heading}>
                                {formatMessage(translations.boilerplate.contact)}
                            </h2>
                            {(hasAddress || isPreview) && (
                                <p
                                    className={classNames(styles.contact, {
                                        [styles.preview]: !companyInformation.address,
                                    })}
                                >
                                    <IconBuilding
                                        aria-hidden
                                        width={16}
                                        height={16}
                                        className={styles.icon}
                                    />
                                    {companyInformation.address ?? 'Company address'}
                                </p>
                            )}
                            {(hasPhone || isPreview) && (
                                <p
                                    className={classNames(styles.contact, {
                                        [styles.preview]: !companyInformation.phone,
                                    })}
                                >
                                    <IconPhone
                                        aria-hidden
                                        width={16}
                                        height={16}
                                        className={styles.icon}
                                    />
                                    <a
                                        className={styles.link}
                                        href={`tel:${
                                            companyInformation.phone ?? '+1 (000) 000-0000'
                                        }`}
                                    >
                                        {companyInformation.phone ?? '+1 (000) 000-0000'}
                                    </a>
                                </p>
                            )}
                            {(hasEmail || isPreview) && (
                                <p
                                    className={classNames(styles.contact, {
                                        [styles.preview]: !companyInformation.email,
                                    })}
                                >
                                    <IconEmail
                                        aria-hidden
                                        width={16}
                                        height={16}
                                        className={styles.icon}
                                    />
                                    <a
                                        className={styles.link}
                                        href={`mailto:${
                                            companyInformation.email ?? 'mail@example.com'
                                        }`}
                                    >
                                        {companyInformation.email ?? 'mail@example.com'}
                                    </a>
                                </p>
                            )}
                            {(companyInformation.website || isPreview) && (
                                <p
                                    className={classNames(styles.contact, {
                                        [styles.preview]: !companyInformation.website,
                                    })}
                                >
                                    <IconGlobe
                                        aria-hidden
                                        width={16}
                                        height={16}
                                        className={styles.icon}
                                    />
                                    <a
                                        href={companyInformation.website ?? newsroom.url}
                                        className={styles.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {getWebsiteHostname(
                                            companyInformation.website ?? newsroom.url,
                                        )}
                                    </a>
                                </p>
                            )}
                        </section>
                    )}
                </div>
                {isPreview && (
                    <a
                        className={styles.settingsLink}
                        href={siteInfoSettingsUrl}
                        onClick={() => analytics.track(PREVIEW.EDIT_SITE_INFORMATION_CLICKED)}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Edit site information <IconExternalLink />
                    </a>
                )}
            </div>
        </section>
    );
}
