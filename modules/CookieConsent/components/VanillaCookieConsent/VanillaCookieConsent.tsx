'use client';

import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

interface Props {
    cookieStatement: string;
}

export function VanillaCookieConsent({ cookieStatement }: Props) {
    const { setConsent, registerUpdatePreferencesCallback } = useCookieConsent();

    useEffect(() => {
        CookieConsent.run({
            autoShow: true,
            cookie: {
                useLocalStorage: true,
            },
            language: {
                default: 'en',
                translations: {
                    en: {
                        consentModal: {
                            title: 'We use cookies',
                            description: cookieStatement,
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            showPreferencesBtn: 'Manage preferences',
                        },
                        preferencesModal: {
                            title: 'Manage cookie preferences',
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            savePreferencesBtn: 'Accept current selection',
                            closeIconLabel: 'Close modal',
                            sections: [
                                ...(cookieStatement ? [{ description: cookieStatement }] : []),
                                {
                                    title: 'Strictly Necessary cookies',
                                    description:
                                        'These cookies are essential for the proper functioning of the website and cannot be disabled.',
                                    linkedCategory: 'necessary',
                                },
                                {
                                    title: 'First-party Analytics',
                                    description:
                                        'Cookies used to collect information about how visitors use our website, directly by us.',
                                    linkedCategory: ConsentCategory.FIRST_PARTY_ANALYTICS,
                                },
                                {
                                    title: 'Third-party Cookies',
                                    description:
                                        'Cookies set by third-party services, such as those used for advertising, social media embeds, and website tracking.',
                                    linkedCategory: ConsentCategory.THIRD_PARTY_COOKIES,
                                },
                            ],
                        },
                    },
                },
            },
            categories: {
                [ConsentCategory.NECESSARY]: {
                    readOnly: true,
                    enabled: true,
                },
                [ConsentCategory.FIRST_PARTY_ANALYTICS]: {},
                [ConsentCategory.THIRD_PARTY_COOKIES]: {},
            },
            onConsent({ cookie }) {
                setConsent((current) => ({
                    ...current,
                    categories: cookie.categories as ConsentCategory[],
                }));
            },
            onChange({ cookie }) {
                setConsent((current) => ({
                    ...current,
                    categories: cookie.categories as ConsentCategory[],
                }));
            },
        });
    }, [cookieStatement, setConsent]);

    useEffect(() => {
        registerUpdatePreferencesCallback(() => {
            CookieConsent.showPreferences();
        });
    });

    return null;
}
