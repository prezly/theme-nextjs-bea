import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateSearchPageMetadata, getSearchSettings, intl } from '@/adapters/server';
import { BroadcastPageType, BroadcastTranslations } from '@/modules/Broadcast';
import { Search } from '@/modules/Search';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { formatMessage } = await intl(params.localeCode);

    return generateSearchPageMetadata({
        locale: params.localeCode,
        title: formatMessage(translations.search.title),
    });
}

export default async function SearchPage({ params }: Props) {
    const searchSettings = getSearchSettings();
    const settings = await app().themeSettings();

    if (!searchSettings) {
        notFound();
    }

    return (
        <>
            <BroadcastTranslations routeName="search" />
            <BroadcastPageType pageType="search" />
            <Search
                settings={searchSettings}
                localeCode={params.localeCode}
                showDate={settings.show_date}
                showSubtitle={settings.show_subtitle}
            />
        </>
    );
}
