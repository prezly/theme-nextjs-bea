import type { Locale } from '@prezly/theme-kit-nextjs';

import { app, routing } from '@/adapters/server';
import { getUploadcareImage, parseLocaleCode } from '@/utils';

import type { LocaleOption } from './LocalePopupOverlay';
import { LocalePopupOverlay } from './LocalePopupOverlay';

interface Props {
    localeCode: Locale.Code;
}

/**
 * Server component: fetches locale data and passes it to the client overlay.
 * Returns null when the newsroom has only one locale (nothing to choose between).
 */
export async function LocalePopup({ localeCode }: Props) {
    const newsroom = await app().newsroom();
    const languages = await app().languages();
    const { generateUrl } = await routing();

    const options: LocaleOption[] = languages
        .filter((lang) =>
            newsroom.is_hub ? lang.hub_public_stories_count > 0 : lang.public_stories_count > 0,
        )
        .map((lang) => ({
            code: lang.code,
            href: generateUrl('index', { localeCode: lang.code }),
            title: lang.locale.native_name,
            countryCode: parseLocaleCode(lang.code),
        }));

    if (options.length <= 1) return null;

    const logoSrc = getUploadcareImage(newsroom.newsroom_logo)?.cdnUrl ?? null;

    return (
        <LocalePopupOverlay
            options={options}
            currentLocale={localeCode}
            logoSrc={logoSrc}
            newsroomName={newsroom.display_name}
        />
    );
}
