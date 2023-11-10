import { PageTitle } from '@/components/PageTitle';
import { api } from '@/theme/server';
import { themeSettings } from '@/theme/settings/server';
import type { DisplayedCategory } from '@/theme-kit';
import { locale } from '@/theme-kit';
import type { StoryWithImage } from 'types';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    category: DisplayedCategory;
    pageSize: number;
}

export async function Category({ category, pageSize }: Props) {
    const { code: localeCode } = locale();
    const { contentDelivery } = api();
    const { stories, pagination } = await contentDelivery.stories({
        limit: pageSize,
        category,
        locale: { code: localeCode },
    });

    const settings = await themeSettings();
    const newsroom = await contentDelivery.newsroom();
    const languageSettings = await contentDelivery.languageOrDefault(locale().code);

    return (
        <>
            <PageTitle title={category.name} subtitle={category.description} />
            <InfiniteStories
                initialStories={stories as StoryWithImage[]} // FIXME
                pageSize={pageSize}
                category={category}
                total={pagination.matched_records_number}
                newsroomName={languageSettings.company_information.name || newsroom.name}
                showDates={settings.show_date}
                showSubtitles={settings.show_subtitle}
            />
        </>
    );
}
