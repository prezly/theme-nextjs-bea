import translations from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useNewsroom } from '@/hooks/useNewsroom';
import { LogoPrezly } from '@/icons';
import { getPrivacyPortalUrl } from '@/utils/prezly';

import styles from './Footer.module.scss';

const Footer = () => {
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();

    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <div className={styles.links}>
                        {/* TODO: Add real link */}
                        <a href="#" className={styles.link}>
                            <FormattedMessage {...translations.actions.privacyRequests} />
                        </a>
                        <a
                            href={getPrivacyPortalUrl(newsroom, currentLocale, {
                                action: 'unsubscribe',
                            })}
                            className={styles.link}
                        >
                            <FormattedMessage {...translations.actions.unsubscribe} />
                        </a>
                        {/* TODO: Implement cookie consent logic */}
                        <a href="#" className={styles.link}>
                            <FormattedMessage {...translations.actions.stopUsingCookies} />
                        </a>
                    </div>
                    <div className={styles.poweredBy}>
                        {/* TODO: Should this be translated ? */}
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
