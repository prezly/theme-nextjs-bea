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
                <div className="relative z-[2] py-10 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-b-gray-200 print:!hidden">
                    <div className={styles.container}>
                        <div className={styles.wrapper}>
                            <div className={styles.content}>
                                <p className={classNames(styles.title, 'dark:text-white')}>
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
                                    className={classNames(styles.button, 'dark:text-white')}
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
