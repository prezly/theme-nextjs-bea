import HCaptcha from '@hcaptcha/react-hcaptcha';
import React, { FormEvent, FunctionComponent, useEffect, useRef, useState } from 'react';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { useNewsroom } from '@/hooks/useNewsroom';
import { getPrivacyPortalUrl } from '@/utils/prezly';
import { HCAPTCHA_SITEKEY } from '@/utils/prezly/constants';

import { validateForm } from './utils';

import styles from './SubscribeForm.module.scss';

const SubscribeForm: FunctionComponent = () => {
    const newsroom = useNewsroom();

    const captchaRef = useRef<HCaptcha>(null);

    const [captchaToken, setCaptchaToken] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [fieldError, setFieldError] = useState<string>();

    const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
        try {
            setFieldError('');
            setIsLoading(true);
            if (event) {
                event.preventDefault();
            }

            if (!newsroom || !captchaRef.current) {
                throw new Error('Something went wrong. Please try submitting the form again');
            }

            const error = validateForm(email);
            if (error) {
                throw new Error(error);
            }

            if (!captchaToken) {
                captchaRef.current.execute();
                setIsLoading(false);
                return;
            }

            window.location.href = getPrivacyPortalUrl(newsroom, { email });
        } catch (error) {
            if (error instanceof Error) {
                setFieldError(error.message);
            }
            setIsLoading(false);
        }
    };

    const handleCaptchaVerify = (token: string) => {
        setCaptchaToken(token);
        handleSubmit();
    };

    // Clear the error when user types in a correct value
    useEffect(() => {
        setFieldError((error) => (error ? validateForm(email) : error));
    }, [email]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Get updates in your mailbox</h2>
            <p className={styles.subtitle}>
                Get all the updates on{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{newsroom?.display_name}</span> in your
                inbox. No spam, unsubscribe at anytime.
            </p>

            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.inlineForm}>
                    <FormInput
                        name="email"
                        type="email"
                        label="Your email address"
                        className={styles.input}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        error={fieldError}
                    />
                    <Button
                        type="submit"
                        variation="primary"
                        className={styles.button}
                        isLoading={isLoading}
                    >
                        Subscribe
                    </Button>
                </div>

                <HCaptcha
                    sitekey={HCAPTCHA_SITEKEY}
                    size="invisible"
                    ref={captchaRef}
                    onVerify={handleCaptchaVerify}
                    onExpire={() => setCaptchaToken(undefined)}
                />

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
