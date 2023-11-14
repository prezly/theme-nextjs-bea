import { translations } from '@prezly/theme-kit-intl';

import { api, intl } from '@/theme/server';

import * as ui from './ui';

import styles from '@/modules/Layout/Footer/ui/Footer.module.scss';

export async function Footer() {
    const { contentDelivery } = api();
    const { locale: localeCode, formatMessage } = await intl();

    const newsroom = await contentDelivery.newsroom();

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
