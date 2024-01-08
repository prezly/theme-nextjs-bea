'use client';

import Captcha from '@hcaptcha/react-hcaptcha';
import type { Newsroom } from '@prezly/sdk';
import { PrivacyPortal, translations } from '@prezly/theme-kit-nextjs';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { FormattedMessage, useIntl } from '@/adapters/client';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';

import { getLocaleCodeForCaptcha, validateEmail } from '../utils';

import styles from './SubscribeForm.module.scss';

// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;

interface Props {
    newsroom: Pick<Newsroom, 'uuid' | 'custom_data_request_link' | 'custom_privacy_policy_link'>;
}

export function SubscribeForm({ newsroom }: Props) {
    const { locale: localeCode, formatMessage } = useIntl();

    const captchaRef = useRef<Captcha>(null);

    const [captchaToken, setCaptchaToken] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState<string>();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    function handleSubmit(event?: FormEvent<HTMLFormElement>) {
        try {
            setEmailError(undefined);
            setIsSubmitting(true);
            if (event) {
                event.preventDefault();
            }

            if (!captchaRef.current) {
                throw new Error(formatMessage(translations.errors.unknown));
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

            const redirect = PrivacyPortal.generateUrl(newsroom, localeCode, { email });

            window.location.href = redirect;
        } catch (error) {
            if (error instanceof Error) {
                setEmailError(error.message);
            }
            setIsSubmitting(false);
        }
    }

    function handleCaptchaVerify(token: string) {
        setCaptchaToken(token);
        handleSubmit();
    }

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
                <FormattedMessage for={translations.subscription.formTitle} />
            </h2>

            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.inlineForm}>
                    <FormInput
                        name="email"
                        type="email"
                        label={formatMessage(translations.subscription.labelEmail)}
                        placeholder={formatMessage(translations.subscription.labelEmail)}
                        className={styles.input}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        error={emailError}
                    />
                    <Button
                        type="submit"
                        variation="primary"
                        className={styles.button}
                        loading={isSubmitting}
                    >
                        <FormattedMessage for={translations.actions.subscribe} />
                    </Button>
                </div>

                <p className={styles.disclaimer}>
                    <FormattedMessage
                        for={translations.subscription.disclaimer}
                        values={{
                            subscribe: <FormattedMessage for={translations.actions.subscribe} />,
                            privacyPolicyLink: (
                                <a
                                    href={
                                        newsroom.custom_privacy_policy_link ??
                                        'https://www.prezly.com/privacy-policy'
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.disclaimerLink}
                                >
                                    <FormattedMessage
                                        for={translations.subscription.privacyPolicy}
                                    />
                                </a>
                            ),
                        }}
                    />
                </p>

                {NEXT_PUBLIC_HCAPTCHA_SITEKEY && isMounted && (
                    <Captcha
                        sitekey={NEXT_PUBLIC_HCAPTCHA_SITEKEY}
                        size="invisible"
                        ref={captchaRef}
                        onVerify={handleCaptchaVerify}
                        onExpire={() => setCaptchaToken(undefined)}
                        languageOverride={getLocaleCodeForCaptcha(localeCode)}
                    />
                )}
            </form>
        </div>
    );
}
