import { api } from '@/theme/server';
import { themeSettings } from '@/theme/settings/server';
import { locale } from '@/theme-kit';
import type { StoryWithImage } from 'types';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    pageSize: number;
}

export async function Stories({ pageSize }: Props) {
    const { contentDelivery } = api();
    const { code: localeCode } = locale();
    const newsroom = await contentDelivery.newsroom();
    const languageSettings = await contentDelivery.languageOrDefault(localeCode);
    const { stories, pagination } = await contentDelivery.stories({
        limit: pageSize,
        locale: { code: localeCode },
    });

    const settings = await themeSettings();

    return (
        <InfiniteStories
            newsroomName={languageSettings.company_information.name || newsroom.name}
            pageSize={pageSize}
            initialStories={stories as StoryWithImage[]} // FIXME
            total={pagination.matched_records_number}
            showDates={settings.show_date}
            showSubtitles={settings.show_subtitle}
        />
    );
}
