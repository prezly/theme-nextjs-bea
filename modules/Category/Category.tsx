import type { Category as CategoryType, TranslatedCategory } from '@prezly/sdk';

import { app } from '@/adapters/server';
import { PageTitle } from '@/components/PageTitle';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    category: CategoryType;
    pageSize: number;
    translatedCategory: TranslatedCategory;
}

export async function Category({ category, pageSize, translatedCategory }: Props) {
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
                initialStories={stories}
                pageSize={pageSize}
                category={category}
                total={pagination.matched_records_number}
                newsroomName={languageSettings.company_information.name || newsroom.name}
                isCategoryList
            />
        </>
    );
}
