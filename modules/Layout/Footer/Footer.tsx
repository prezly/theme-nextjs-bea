import dynamic from 'next/dynamic';

import { LogoPrezly } from '@/icons';

import styles from './Footer.module.scss';

const CookieConsentLink = dynamic(
    () => import('@/modules/analytics/components/CookieConsentLink'),
    { ssr: false },
);

const Footer = () => (
    <footer className={styles.container}>
        <div className="container">
            <div className={styles.footer}>
                <div className={styles.links}>
                    {/* Blocked by https://linear.app/prezly/issue/TITS-3569/implement-gdpr-data-privacy-requests-api */}
                    {/* <a href="#" className={styles.link}>
                            <FormattedMessage {...translations.actions.privacyRequests} />
                        </a> */}
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

export default Footer;
