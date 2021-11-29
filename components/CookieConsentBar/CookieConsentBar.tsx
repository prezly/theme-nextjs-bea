import { FunctionComponent } from 'react';

import { Button } from '@/components';
import { useCookieConsent } from '@/hooks';

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
                        <p className={styles.title}>We would like to use cookies</p>
                        <p className={styles.text}>
                            We use cookies on our website. They help us get to know you a little and
                            how you use our website. This helps us provide a more valuable and
                            tailored experience for you and others.
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <Button className={styles.button} onClick={reject} variation="secondary">
                            No, do not use cookies
                        </Button>
                        <Button className={styles.button} onClick={accept} variation="primary">
                            Yes, you can use cookies
                        </Button>
                        <p className={styles.notice}>
                            You can revoke cookies at anytime at the bottom of the page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentBar;
