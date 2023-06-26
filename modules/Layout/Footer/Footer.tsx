import { CookieConsentLink } from '@prezly/analytics-nextjs';
import { useNewsroom } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { useIntl } from 'react-intl';

import { LogoPrezly } from '@/icons';

import { DataRequestLink } from './DataRequestLink';

import styles from './Footer.module.scss';

function Footer() {
    const newsroom = useNewsroom();
    const { formatMessage } = useIntl();

    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <div className={styles.links}>
                        <DataRequestLink className={styles.link} />
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
                    {!newsroom.is_white_labeled && (
                        <div className={styles.poweredBy}>
                            Made with
                            <a
                                href="https://prez.ly/storytelling-platform"
                                className={styles.prezly}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LogoPrezly height={20} className={styles.prezlyLogo} />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
