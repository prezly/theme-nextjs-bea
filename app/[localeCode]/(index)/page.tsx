import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { Stories } from '@/modules/Stories';
import { themeSettings } from '@/theme/settings/server';
import { api } from '@/theme-kit';
import { generateHomepageMetadata } from '@/theme-kit/metadata';
import type { StoryWithImage } from 'types';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export function generateMetadata({ params }: Props): Promise<Metadata> {
    return generateHomepageMetadata({
        localeCode: params.localeCode,
    });
}

export default async function StoriesIndexPage({ params }: Props) {
    const { contentDelivery } = api();
    const newsroom = await contentDelivery.newsroom();
    const languageSettings = await contentDelivery.languageOrDefault(params.localeCode);
    const languages = await contentDelivery.languages();
    const { stories, pagination } = await contentDelivery.stories({
        limit: DEFAULT_PAGE_SIZE,
        locale: { code: params.localeCode },
    });

    const settings = await themeSettings();

    return (
        <ul>
            <DeclareLanguages
                languages={languages.filter((lang) => lang.public_stories_count > 0)}
                routeName="index"
            />
            <Stories
                newsroomName={languageSettings.company_information.name || newsroom.display_name}
                pageSize={DEFAULT_PAGE_SIZE}
                initialStories={stories as StoryWithImage[]} // FIXME
                total={pagination.matched_records_number}
                showDates={settings.show_date}
                showSubtitles={settings.show_subtitle}
            />
        </ul>
    );
}
