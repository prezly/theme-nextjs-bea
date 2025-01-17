'use client';

import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

export function VanillaCookieConsent() {
    const { setConsent } = useCookieConsent();

    useEffect(() => {
        CookieConsent.run({
            autoShow: true,
            language: {
                default: 'en',
                translations: {
                    en: {
                        consentModal: {
                            title: 'We use cookies',
                            description: 'Cookie modal description',
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            showPreferencesBtn: 'Manage Individual preferences',
                        },
                        preferencesModal: {
                            title: 'Manage cookie preferences',
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            savePreferencesBtn: 'Accept current selection',
                            closeIconLabel: 'Close modal',
                            sections: [
                                {
                                    title: 'Somebody said ... cookies?',
                                    description: 'I want one!',
                                },
                                {
                                    title: 'Strictly Necessary cookies',
                                    description:
                                        'These cookies are essential for the proper functioning of the website and cannot be disabled.',

                                    linkedCategory: 'necessary',
                                },
                                {
                                    title: 'Performance and Analytics',
                                    description:
                                        'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                                    linkedCategory: 'analytics',
                                },
                                {
                                    title: 'More information',
                                    description:
                                        'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>',
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
    }, [setConsent]);

    return null;
}
