import type { TranslatedCategory } from '@prezly/sdk';

import { app, intl } from '@/adapters/server';
import { PageTitle } from '@/components/PageTitle';
import type { ListStory } from 'types';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    category: TranslatedCategory;
    pageSize: number;
}

export async function Category({ category, pageSize }: Props) {
    const { locale: localeCode } = await intl();
    const { stories, pagination } = await app().stories({
        limit: pageSize,
        category,
        locale: { code: localeCode },
    });

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);

    return (
        <>
            <PageTitle title={category.name} subtitle={category.description} />
            <InfiniteStories
                initialStories={stories as ListStory[]} // FIXME
                pageSize={pageSize}
                category={category}
                total={pagination.matched_records_number}
                newsroomName={languageSettings.company_information.name || newsroom.name}
            />
        </>
    );
}
