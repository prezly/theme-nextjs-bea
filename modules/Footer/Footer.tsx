import type { Locale } from '@prezly/theme-kit-nextjs';
import { PrivacyPortal, translations } from '@prezly/theme-kit-nextjs';
import * as ui from '@prezly/theme-kit-ui';

import { app, intl } from '@/adapters/server';
import { getSocialLinks } from '@/components/SocialMedia/utils';

interface Props {
    localeCode: Locale.Code;
}

export async function Footer({ localeCode }: Props) {
    const { formatMessage } = await intl(localeCode);

    const newsroom = await app().newsroom();
    const language = await app().languageOrDefault(localeCode);

    return (
        <ui.Footer
            companySocials={getSocialLinks(language.company_information)}
            isWhiteLabeled={newsroom.is_white_labeled}
            externalSiteLink={undefined}
            hasStandaloneAboutPage={false}
            publicGalleriesCount={newsroom.public_galleries_number}
            newsroomName={language.company_information.name || newsroom.name}
            privacyRequestLink={PrivacyPortal.getDataRequestUrl(newsroom, localeCode)}
            intl={{
                [`contacts.title`]: formatMessage(translations.contacts.title),
                [`boilerplate.about`]: formatMessage(translations.boilerplate.title, {
                    companyName: language.company_information.name || newsroom.name,
                }),
                [`mediaGallery.title`]: formatMessage(translations.mediaGallery.title),
                // 'allStories.title': ..., // FIXME: Add this to translations
                [`actions.startUsingCookies`]: formatMessage(
                    translations.actions.startUsingCookies,
                ),
                [`actions.stopUsingCookies`]: formatMessage(translations.actions.stopUsingCookies),
                [`actions.privacyRequests`]: formatMessage(translations.actions.privacyRequests),
            }}
        />
    );
}
