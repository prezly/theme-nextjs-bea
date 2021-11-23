import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
    actionSubscribe,
    captchaDisclaimer,
    errorUnknown,
    labelEmail,
    privacyPolicy,
    subscribeFormTitle,
    termsOfService,
} from '@prezly/themes-intl-messages';
import React, { FormEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useNewsroom } from '@/hooks/useNewsroom';
import { getPrivacyPortalUrl } from '@/utils/prezly';

import { validateEmail } from './utils';

import styles from './SubscribeForm.module.scss';

// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;

const SubscribeForm: FunctionComponent = () => {
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();
    const { formatMessage } = useIntl();

    const captchaRef = useRef<HCaptcha>(null);

    const [captchaToken, setCaptchaToken] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState<string>();

    const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
        try {
            setEmailError(undefined);
            setIsSubmitting(true);
            if (event) {
                event.preventDefault();
            }

            if (!captchaRef.current) {
                throw new Error(formatMessage(errorUnknown));
            }

            const errorMessageDescriptor = validateEmail(email);
            if (errorMessageDescriptor) {
                throw new Error(formatMessage(errorMessageDescriptor));
            }

            if (!captchaToken) {
                captchaRef.current.execute();
                setIsSubmitting(false);
                return;
            }

            window.location.href = getPrivacyPortalUrl(newsroom, currentLocale, { email });
        } catch (error) {
            if (error instanceof Error) {
                setEmailError(error.message);
            }
            setIsSubmitting(false);
        }
    };

    const handleCaptchaVerify = (token: string) => {
        setCaptchaToken(token);
        handleSubmit();
    };

    // Clear the error when user types in a correct value
    useEffect(() => {
        setEmailError((error) => {
            if (error) {
                const errorMessageDescriptor = validateEmail(email);
                return errorMessageDescriptor ? formatMessage(errorMessageDescriptor) : undefined;
            }

            return error;
        });
    }, [email, formatMessage]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                <FormattedMessage {...subscribeFormTitle} />
            </h2>

            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.inlineForm}>
                    <FormInput
                        name="email"
                        type="email"
                        label={formatMessage(labelEmail)}
                        className={styles.input}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        error={emailError}
                    />
                    <Button
                        type="submit"
                        variation="primary"
                        className={styles.button}
                        isLoading={isSubmitting}
                    >
                        <FormattedMessage {...actionSubscribe} />
                    </Button>
                </div>

                {NEXT_PUBLIC_HCAPTCHA_SITEKEY && (
                    <>
                        <HCaptcha
                            sitekey={NEXT_PUBLIC_HCAPTCHA_SITEKEY}
                            size="invisible"
                            ref={captchaRef}
                            onVerify={handleCaptchaVerify}
                            onExpire={() => setCaptchaToken(undefined)}
                            languageOverride={currentLocale}
                        />
                        <p className={styles.captchaDisclaimer}>
                            <FormattedMessage
                                {...captchaDisclaimer}
                                values={{
                                    privacyPolicyLink: (
                                        <a
                                            href="https://www.hcaptcha.com/privacy"
                                            className={styles.disclaimerLink}
                                        >
                                            <FormattedMessage {...privacyPolicy} />
                                        </a>
                                    ),
                                    termsOfServiceLink: (
                                        <a
                                            href="https://www.hcaptcha.com/terms"
                                            className={styles.disclaimerLink}
                                        >
                                            <FormattedMessage {...termsOfService} />
                                        </a>
                                    ),
                                }}
                            />
                        </p>
                    </>
                )}
            </form>
        </div>
    );
};

export default SubscribeForm;
