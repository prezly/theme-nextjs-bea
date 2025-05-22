import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateSearchPageMetadata, getSearchSettings, intl } from '@/adapters/server';
import { BroadcastPageType, BroadcastTranslations } from '@/modules/Broadcast';
import { Search } from '@/modules/Search';
import { parsePreviewSearchParams } from '@/utils';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
    searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { formatMessage } = await intl(params.localeCode);

    return generateSearchPageMetadata({
        locale: params.localeCode,
        title: formatMessage(translations.search.title),
    });
}

export default async function SearchPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const searchSettings = getSearchSettings();
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);
    const newsroom = await app().newsroom();
    const memberNewsrooms = await getMemberNewsrooms(newsroom);

    if (!searchSettings) {
        notFound();
    }

    return (
        <>
            <BroadcastTranslations routeName="search" />
            <BroadcastPageType pageType="search" />
            <Search
                localeCode={params.localeCode}
                newsrooms={[newsroom, ...memberNewsrooms]}
                newsroomUuid={newsroom.uuid}
                settings={searchSettings}
                showDate={themeSettings.show_date}
                showSubtitle={themeSettings.show_subtitle}
                storyCardVariant={themeSettings.story_card_variant}
            />
        </>
    );
}

async function getMemberNewsrooms(newsroom: Newsroom) {
    if (newsroom.is_hub) {
        const members = await app().client.newsroomHub.list(newsroom.uuid);
        return members.map((member) => member.newsroom);
    }

    return [];
}
