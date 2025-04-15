import type { Category as CategoryType, TranslatedCategory } from '@prezly/sdk';

import { app } from '@/adapters/server';
import { PageTitle } from '@/components/PageTitle';
import type { ThemeSettings } from '@/theme-settings';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    category: CategoryType;
    layout: ThemeSettings['layout'];
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
    translatedCategory: TranslatedCategory;
}

export async function Category({
    category,
    layout,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
    translatedCategory,
}: Props) {
    const { stories, pagination } = await app().stories({
        limit: pageSize,
        category,
        locale: { code: translatedCategory.locale },
    });

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(translatedCategory.locale);

    return (
        <>
            <PageTitle title={translatedCategory.name} subtitle={translatedCategory.description} />
            <InfiniteStories
                category={category}
                initialStories={stories}
                isCategoryList
                layout={layout}
                newsroomName={languageSettings.company_information.name || newsroom.name}
                pageSize={pageSize}
                showDate={showDate}
                showSubtitle={showSubtitle}
                storyCardVariant={storyCardVariant}
                total={pagination.matched_records_number}
            />
        </>
    );
}
