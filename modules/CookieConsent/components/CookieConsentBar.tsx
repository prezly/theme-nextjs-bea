'use client';

import { CookieConsentBar as DefaultCookieConsentBar } from '@prezly/analytics-nextjs';
import type { NewsroomCompanyInformation } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import { useMaskParam } from 'hooks';

import styles from './CookieConsentBar.module.scss';

interface Props {
    children?: NewsroomCompanyInformation['cookie_statement'];
}

export function CookieConsentBar({ children }: Props) {
    const locale = useLocale();
    const isHidden = useMaskParam();

    if (isHidden) {
        return null;
    }

    return (
        <DefaultCookieConsentBar>
            {({ onAccept, onReject }) => (
                <div className={styles.cookieConsentBar}>
                    <div className={styles.container}>
                        <div className={styles.wrapper}>
                            <div className={styles.content}>
                                <p className={styles.title}>
                                    <FormattedMessage
                                        locale={locale}
                                        for={translations.cookieConsent.title}
                                    />
                                </p>
                                {children ? (
                                    <div
                                        className={classNames(styles.text, styles.custom)}
                                        dangerouslySetInnerHTML={{ __html: children }}
                                    />
                                ) : (
                                    <p className={styles.text}>
                                        <FormattedMessage
                                            locale={locale}
                                            for={translations.cookieConsent.description}
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
                                    <FormattedMessage
                                        locale={locale}
                                        for={translations.cookieConsent.reject}
                                    />
                                </Button>
                                <Button
                                    className={styles.button}
                                    onClick={onAccept}
                                    variation="primary"
                                >
                                    <FormattedMessage
                                        locale={locale}
                                        for={translations.cookieConsent.accept}
                                    />
                                </Button>
                                <p className={styles.notice}>
                                    <FormattedMessage
                                        locale={locale}
                                        for={translations.cookieConsent.notice}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultCookieConsentBar>
    );
}
