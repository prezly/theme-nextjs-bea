import { CookieConsentLink } from '@prezly/analytics-nextjs';
import { translations } from '@prezly/theme-kit-intl';
import { useNewsroom } from '@prezly/theme-kit-nextjs';
import { useIntl } from 'react-intl';

import { MadeWithPrezly } from '@/components/MadeWithPrezly';

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
                    {!newsroom.is_white_labeled && <MadeWithPrezly />}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
