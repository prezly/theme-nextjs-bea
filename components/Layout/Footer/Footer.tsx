import { defineMessages, FormattedMessage } from 'react-intl';

import { useNewsroom } from '@/hooks/useNewsroom';
import { LogoPrezly } from '@/icons';
import { getPrivacyPortalUrl } from '@/utils/prezly';

import styles from './Footer.module.scss';

const messages = defineMessages({
    actionPrivacyRequest: {
        defaultMessage: 'Privacy Request',
    },
    actionUnsubscribe: {
        defaultMessage: 'Unsubscribe',
    },
    actionStopUsingCookies: {
        defaultMessage: 'Stop using cookies',
    },
});

const Footer = () => {
    const newsroom = useNewsroom();

    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <div className={styles.links}>
                        {/* TODO: Add real link */}
                        <a href="#" className={styles.link}>
                            <FormattedMessage {...messages.actionPrivacyRequest} />
                        </a>
                        <a
                            href={getPrivacyPortalUrl(newsroom, { action: 'unsubscribe' })}
                            className={styles.link}
                        >
                            <FormattedMessage {...messages.actionUnsubscribe} />
                        </a>
                        {/* TODO: Implement cookie consent logic */}
                        <a href="#" className={styles.link}>
                            <FormattedMessage {...messages.actionStopUsingCookies} />
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
