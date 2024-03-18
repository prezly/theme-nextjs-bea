import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    categoryId: Category['id'] | undefined;
    localeCode: Locale.Code;
    pageSize: number;
}

export async function Stories({ categoryId, localeCode, pageSize }: Props) {
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);
    const categories = await app().categories();
    const hasFeaturedCategories = categories.some(
        (category) => category.is_featured && category.i18n[localeCode]?.public_stories_number > 0,
    );

    const { stories: pinnedOrMostRecentStories } = await app().stories({
        limit: 1,
        locale: { code: localeCode },
    });

    const { stories, pagination } = await app().stories({
        category: categoryId ? { id: categoryId } : undefined,
        limit: pageSize,
        locale: { code: localeCode },
    });

    return (
        <InfiniteStories
            key={categoryId}
            category={categoryId ? { id: categoryId } : undefined}
            categories={categories}
            newsroomName={languageSettings.company_information.name || newsroom.name}
            pageSize={pageSize}
            initialStories={
                hasFeaturedCategories ? [...pinnedOrMostRecentStories, ...stories] : stories
            }
            total={pagination.matched_records_number}
        />
    );
}
