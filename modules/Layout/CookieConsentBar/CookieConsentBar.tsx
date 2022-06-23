import { CookieConsentBar as DefaultCookieConsentBar } from '@prezly/analytics-nextjs';
import { useCompanyInformation } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import styles from './CookieConsentBar.module.scss';

function CookieConsentBar() {
    const { cookie_statement: cookieStatement } = useCompanyInformation();

    return (
        <DefaultCookieConsentBar>
            {({ onAccept, onReject }) => (
                <div className={styles.cookieConsentBar}>
                    <div className={styles.container}>
                        <div className={styles.wrapper}>
                            <div className={styles.content}>
                                <p className={styles.title}>
                                    <FormattedMessage {...translations.cookieConsent.title} />
                                </p>
                                {cookieStatement ? (
                                    <div
                                        className={classNames(styles.text, styles.custom)}
                                        dangerouslySetInnerHTML={{ __html: cookieStatement }}
                                    />
                                ) : (
                                    <p className={styles.text}>
                                        <FormattedMessage
                                            {...translations.cookieConsent.description}
                                        />
                                    </p>
                                )}
                            </div>
                            <div className={styles.actions}>
                                <Button
                                    className={styles.button}
                                    onClick={onReject}
                                    variation="secondary"
                                >
                                    <FormattedMessage {...translations.cookieConsent.reject} />
                                </Button>
                                <Button
                                    className={styles.button}
                                    onClick={onAccept}
                                    variation="primary"
                                >
                                    <FormattedMessage {...translations.cookieConsent.accept} />
                                </Button>
                                <p className={styles.notice}>
                                    <FormattedMessage {...translations.cookieConsent.notice} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultCookieConsentBar>
    );
}

export default CookieConsentBar;
