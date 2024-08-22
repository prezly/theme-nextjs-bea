import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateSearchPageMetadata, getSearchSettings, intl } from '@/adapters/server';
import { BroadcastPageType, BroadcastTranslations } from '@/modules/Broadcast';
import { Search } from '@/modules/Search';
import { parsePreviewSearchParams } from 'utils';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    searchParams: Record<string, string>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { formatMessage } = await intl(params.localeCode);

    return generateSearchPageMetadata({
        locale: params.localeCode,
        title: formatMessage(translations.search.title),
    });
}

export default async function SearchPage({ params, searchParams }: Props) {
    const searchSettings = getSearchSettings();
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

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
                showDate={themeSettings.show_date}
                showSubtitle={themeSettings.show_subtitle}
                storyCardVariant={themeSettings.story_card_variant}
            />
        </>
    );
}
