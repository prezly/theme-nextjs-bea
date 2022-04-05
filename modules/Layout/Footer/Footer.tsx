import type { CookieConsentLink as CookieConsentLinkType } from '@prezly/analytics-nextjs';
import { getPrivacyPortalUrl, useCurrentLocale, useNewsroom } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { LogoPrezly } from '@/icons';

import styles from './Footer.module.scss';

type CookieConsentLinkPropsType = ComponentProps<typeof CookieConsentLinkType>;

const CookieConsentLink = dynamic<CookieConsentLinkPropsType>(
    () => import('@prezly/analytics-nextjs').then((module) => module.CookieConsentLink),
    { ssr: false },
);

function Footer() {
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();
    const { formatMessage } = useIntl();

    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <div className={styles.links}>
                        <a
                            href={getPrivacyPortalUrl(newsroom, currentLocale, {
                                action: 'data-request',
                            })}
                            className={styles.link}
                        >
                            <FormattedMessage {...translations.actions.privacyRequests} />
                        </a>
                        <CookieConsentLink
                            className={styles.link}
                            startUsingCookiesLabel={formatMessage(
                                translations.actions.startUsingCookies,
                            )}
                            stopUsingCookiesLabel={formatMessage(
                                translations.actions.stopUsingCookies,
                            )}
                        />
                    </div>
                    <div className={styles.poweredBy}>
                        Powered by
                        <a
                            href="https://prezly.com"
                            className={styles.prezly}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <LogoPrezly />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
