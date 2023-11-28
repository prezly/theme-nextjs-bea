import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';

import { app, intl } from '@/adapters/server';

import * as ui from './ui';

import styles from './ui/Footer.module.scss';

interface Props {
    localeCode: Locale.Code;
}

export async function Footer({ localeCode }: Props) {
    const { formatMessage } = await intl(localeCode);

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
