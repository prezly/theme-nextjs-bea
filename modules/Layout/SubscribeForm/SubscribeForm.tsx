import HCaptcha from '@hcaptcha/react-hcaptcha';
import { getPrivacyPortalUrl, useCurrentLocale, useNewsroom } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@/components/TailwindSpotlight/Button';

import { MailIcon } from './MailIcon';
import { getLocaleCodeForCaptcha, validateEmail } from './utils';

// eslint-disable-next-line prefer-destructuring
const NEXT_PUBLIC_HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;

const isCaptchaEnabled = Boolean(NEXT_PUBLIC_HCAPTCHA_SITEKEY);

function SubscribeForm() {
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();
    const { formatMessage } = useIntl();

    const captchaRef = useRef<HCaptcha>(null);

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

            if (isCaptchaEnabled && !captchaRef.current) {
                throw new Error(formatMessage(translations.errors.unknown));
            }

            const errorMessageDescriptor = validateEmail(email);
            if (errorMessageDescriptor) {
                throw new Error(formatMessage(errorMessageDescriptor));
            }

            if (isCaptchaEnabled && !captchaToken) {
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
        <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
        >
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <MailIcon className="h-6 w-6 flex-none" />
                <span className="ml-3">Stay up to date</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Get notified when I publish something new, and unsubscribe at any time.
            </p>
            <div className="mt-6 flex items-start">
                <label className="flex-auto">
                    <span className="sr-only">Email address</span>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        aria-label="Email address"
                        required
                        className="block w-full appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-rose-400 dark:focus:ring-rose-400/10 sm:text-sm"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    {emailError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{emailError}</p>
                    )}
                </label>
                <Button buttonType="submit" className="ml-4 flex-none" disabled={isSubmitting}>
                    Join
                </Button>
            </div>

            {isCaptchaEnabled && isMounted && (
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
    );
}

export default SubscribeForm;
