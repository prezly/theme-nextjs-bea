'use client';

import { CookieConsentBar as DefaultCookieConsentBar } from '@prezly/analytics-nextjs';
import type { NewsroomCompanyInformation } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';
import classNames from 'classnames';

import { FormattedMessage } from '@/theme/client';
import { Button } from '@/ui';

import styles from './CookieConsentBar.module.scss';

interface Props {
    children?: NewsroomCompanyInformation['cookie_statement'];
}

export default function CookieConsentBar({ children }: Props) {
    return (
        <DefaultCookieConsentBar>
            {({ onAccept, onReject }) => (
                <div className={styles.cookieConsentBar}>
                    <div className={styles.container}>
                        <div className={styles.wrapper}>
                            <div className={styles.content}>
                                <p className={styles.title}>
                                    <FormattedMessage for={translations.cookieConsent.title} />
                                </p>
                                {children ? (
                                    <div
                                        className={classNames(styles.text, styles.custom)}
                                        dangerouslySetInnerHTML={{ __html: children }}
                                    />
                                ) : (
                                    <p className={styles.text}>
                                        <FormattedMessage
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
                                    <FormattedMessage for={translations.cookieConsent.reject} />
                                </Button>
                                <Button
                                    className={styles.button}
                                    onClick={onAccept}
                                    variation="primary"
                                >
                                    <FormattedMessage for={translations.cookieConsent.accept} />
                                </Button>
                                <p className={styles.notice}>
                                    <FormattedMessage for={translations.cookieConsent.notice} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultCookieConsentBar>
    );
}
