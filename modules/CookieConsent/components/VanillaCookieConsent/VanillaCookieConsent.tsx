'use client';

import { translations, useIntl } from '@prezly/theme-kit-nextjs';
import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

import './VanillaCookieConsent.scss';

interface Props {
    cookieStatement: string;
}

const PRIVACY_POLICY_PAGE = '/privacy-policy';
const COOKIE_POLICY_PAGE = '/cookie-policy';

export function VanillaCookieConsent({ cookieStatement }: Props) {
    const { formatMessage } = useIntl();
    const { setConsent, registerUpdatePreferencesCallback } = useCookieConsent();

    const policyLinksHtml = `\
        <p>
            <a target="_blank" href="${PRIVACY_POLICY_PAGE}">${formatMessage(
                translations.cookieConsent.privacyPolicy,
            )}</a>
            &nbsp;
            <a target="_blank" href="${COOKIE_POLICY_PAGE}">${formatMessage(
                translations.cookieConsent.cookiePolicy,
            )}</a>
        </p>
    `;

    useEffect(() => {
        CookieConsent.run({
            autoShow: true,
            cookie: {
                useLocalStorage: true,
            },
            guiOptions: {
                consentModal: {
                    layout: 'box',
                    position: 'bottom left',
                    flipButtons: false,
                    equalWeightButtons: true,
                },
                preferencesModal: {
                    layout: 'box',
                    position: 'right',
                    equalWeightButtons: false,
                    flipButtons: true,
                },
            },
            language: {
                default: 'dynamic',
                translations: {
                    dynamic: {
                        consentModal: {
                            title: formatMessage(translations.cookieConsent.title),
                            description: `${cookieStatement}<br/><br/>${policyLinksHtml}`,
                            acceptAllBtn: formatMessage(translations.cookieConsent.acceptAll),
                            acceptNecessaryBtn: formatMessage(translations.cookieConsent.rejectAll),
                            showPreferencesBtn: formatMessage(
                                translations.cookieConsent.managePreferences,
                            ),
                        },
                        preferencesModal: {
                            title: formatMessage(translations.cookieConsent.managePreferencesTitle),
                            acceptAllBtn: formatMessage(translations.cookieConsent.acceptAll),
                            acceptNecessaryBtn: formatMessage(translations.cookieConsent.rejectAll),
                            savePreferencesBtn: formatMessage(
                                translations.cookieConsent.acceptSelection,
                            ),
                            closeIconLabel: 'Close modal',
                            sections: [
                                cookieStatement
                                    ? {
                                          description: `${cookieStatement}<br/><br/>${policyLinksHtml}`,
                                      }
                                    : { description: policyLinksHtml },
                                {
                                    title: formatMessage(
                                        translations.cookieConsent.categoryNecessary,
                                    ),
                                    description: formatMessage(
                                        translations.cookieConsent.categoryNecessaryDescription,
                                    ),
                                    linkedCategory: 'necessary',
                                },
                                {
                                    title: formatMessage(
                                        translations.cookieConsent.categoryFirstParty,
                                    ),
                                    description: formatMessage(
                                        translations.cookieConsent.categoryFirstPartyDescription,
                                    ),
                                    linkedCategory: ConsentCategory.FIRST_PARTY_ANALYTICS,
                                },
                                {
                                    title: formatMessage(
                                        translations.cookieConsent.categoryThirdParty,
                                    ),
                                    description: formatMessage(
                                        translations.cookieConsent.categoryThirdPartyDescription,
                                    ),
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
    }, [cookieStatement, formatMessage, policyLinksHtml, setConsent]);

    useEffect(() => {
        const consentCategories = CookieConsent.getUserPreferences().acceptedCategories;

        if (consentCategories) {
            setConsent({ categories: consentCategories as ConsentCategory[] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        registerUpdatePreferencesCallback(() => {
            CookieConsent.showPreferences();
        });
    }, [registerUpdatePreferencesCallback]);

    return null;
}
