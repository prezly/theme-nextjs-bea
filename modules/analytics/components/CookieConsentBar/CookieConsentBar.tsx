import translations from '@prezly/themes-intl-messages';
import { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@/components';

import { useCookieConsent } from '../../hooks';

import styles from './CookieConsentBar.module.scss';

const CookieConsentBar: FunctionComponent = () => {
    const { accept, isTrackingAllowed, reject, supportsCookie } = useCookieConsent();

    if (!supportsCookie || isTrackingAllowed !== null) {
        return null;
    }

    return (
        <div className={styles.cookieConsentBar}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        <p className={styles.title}>
                            <FormattedMessage {...translations.cookieConsent.title} />
                        </p>
                        <p className={styles.text}>
                            <FormattedMessage {...translations.cookieConsent.description} />
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <Button className={styles.button} onClick={reject} variation="secondary">
                            <FormattedMessage {...translations.cookieConsent.reject} />
                        </Button>
                        <Button className={styles.button} onClick={accept} variation="primary">
                            <FormattedMessage {...translations.cookieConsent.accept} />
                        </Button>
                        <p className={styles.notice}>
                            <FormattedMessage {...translations.cookieConsent.notice} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentBar;
