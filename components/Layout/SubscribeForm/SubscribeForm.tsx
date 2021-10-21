import HCaptcha from '@hcaptcha/react-hcaptcha';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { useNewsroom } from '@/hooks/useNewsroom';
import { HCAPTCHA_SITEKEY } from '@/utils/prezly/constants';

import styles from './SubscribeForm.module.scss';

const SubscribeForm: FunctionComponent = () => {
    const newsroom = useNewsroom();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Get updates in your mailbox</h2>
            <p className={styles.subtitle}>
                Get all the updates on{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{newsroom?.display_name}</span> in your
                inbox. No spam, unsubscribe at anytime.
            </p>

            <form>
                <div className={styles.inlineForm}>
                    <FormInput
                        name="email"
                        type="email"
                        label="Your email address"
                        required
                        className={styles.input}
                    />
                    <Button type="submit" variation="primary" className={styles.button}>
                        Subscribe
                    </Button>
                </div>

                <HCaptcha sitekey={HCAPTCHA_SITEKEY} size="invisible" />

                <p className={styles.captchaDisclaimer}>
                    This site is protected by hCaptcha and its{' '}
                    <a href="https://www.hcaptcha.com/privacy" className={styles.disclaimerLink}>
                        Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="https://www.hcaptcha.com/terms" className={styles.disclaimerLink}>
                        Terms of Service
                    </a>{' '}
                    apply.
                </p>
            </form>
        </div>
    );
};

export default SubscribeForm;
