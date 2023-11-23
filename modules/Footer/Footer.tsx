import { translations } from '@prezly/theme-kit-nextjs';

import { app, intl } from '@/adapters/server';

import * as ui from './ui';

import styles from './ui/Footer.module.scss';

export async function Footer() {
    const { locale: localeCode, formatMessage } = await intl();

    const newsroom = await app().newsroom();

    return (
        <ui.Footer isWhiteLabel={newsroom.is_white_labeled}>
            <ui.DataRequestLink className={styles.link} newsroom={newsroom} localeCode={localeCode}>
                {formatMessage(translations.actions.privacyRequests)}
            </ui.DataRequestLink>
            <ui.CookieConsentLink
                className={styles.link}
                startUsingCookiesLabel={formatMessage(translations.actions.startUsingCookies)}
                stopUsingCookiesLabel={formatMessage(translations.actions.stopUsingCookies)}
            />
        </ui.Footer>
    );
}
