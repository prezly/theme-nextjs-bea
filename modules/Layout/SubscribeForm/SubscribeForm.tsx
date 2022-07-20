import HCaptcha from '@hcaptcha/react-hcaptcha';
import { getPrivacyPortalUrl, useCurrentLocale, useNewsroom } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { Button, FormInput } from '@prezly/themes-ui-components';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { getLocaleCodeForCaptcha, validateEmail } from './utils';

// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;

function SubscribeForm() {
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();
    const { formatMessage } = useIntl();

    const captchaRef = useRef<HCaptcha>(null);

    const [captchaToken, setCaptchaToken] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState<string>();

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

            window.location.href = getPrivacyPortalUrl(newsroom, currentLocale, { email });
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

    if (!newsroom.is_subscription_form_enabled) {
        return null;
    }

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
                <div className="py-10 px-6 bg-gray-700 rounded-3xl sm:py-16 sm:px-12 lg:p-20 lg:flex lg:items-center">
                    <div className="lg:w-0 lg:flex-1">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white">
                            Want to receive email updates?
                        </h2>
                        <p className="mt-4 max-w-3xl text-lg text-white">
                            Sign up for my newsletter and be notified whenever I hit publish
                        </p>
                    </div>
                    <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                        {emailError && (
                            <div className="p-4 bg-rose-500 rounded my-4">{emailError}</div>
                        )}
                        <form className="sm:flex" onSubmit={handleSubmit} noValidate>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder={formatMessage(translations.subscription.labelEmail)}
                                className="w-full border-white dark:text-black px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white rounded-md"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <button
                                type="submit"
                                className="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
                            >
                                <FormattedMessage {...translations.actions.subscribe} />
                            </button>
                        </form>
                        <p className="mt-3 text-sm text-white">
                            <FormattedMessage
                                {...translations.subscription.disclaimer}
                                values={{
                                    subscribe: (
                                        <FormattedMessage {...translations.actions.subscribe} />
                                    ),
                                    privacyPolicyLink: (
                                        <a
                                            href={
                                                newsroom.custom_privacy_policy_link ??
                                                'https://www.prezly.com/privacy-policy'
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FormattedMessage
                                                {...translations.subscription.privacyPolicy}
                                            />
                                        </a>
                                    ),
                                }}
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
            <div className="px-6 py-6 bg-slate-700 rounded-lg md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
                <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
                    <form onSubmit={handleSubmit} noValidate className="sm:flex">
                        <FormInput
                            name="email"
                            type="email"
                            label={formatMessage(translations.subscription.labelEmail)}
                            placeholder={formatMessage(translations.subscription.labelEmail)}
                            className="w-full border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white rounded-md"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            error={emailError}
                        />
                        <Button
                            type="submit"
                            variation="primary"
                            className="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
                            isLoading={isSubmitting}
                        >
                            <FormattedMessage {...translations.actions.subscribe} />
                        </Button>

                        {NEXT_PUBLIC_HCAPTCHA_SITEKEY && (
                            <HCaptcha
                                sitekey={NEXT_PUBLIC_HCAPTCHA_SITEKEY}
                                size="invisible"
                                ref={captchaRef}
                                onVerify={handleCaptchaVerify}
                                onExpire={() => setCaptchaToken(undefined)}
                                languageOverride={getLocaleCodeForCaptcha(currentLocale)}
                            />
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubscribeForm;
