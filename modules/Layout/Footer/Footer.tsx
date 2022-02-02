import { getPrivacyPortalUrl, useCurrentLocale, useNewsroom } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';

import { LogoPrezly } from '@/icons';

import styles from './Footer.module.scss';

const CookieConsentLink = dynamic(
    () => import('@/modules/analytics/components/CookieConsentLink'),
    { ssr: false },
);

const Footer = () => {
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();

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
                        <CookieConsentLink className={styles.link} />
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
};

export default Footer;
