import { app } from '@/adapters/server';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    pageSize: number;
}

export async function Stories({ pageSize }: Props) {
    const localeCode = app().locale();
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault();
    const { stories, pagination } = await app().stories({
        limit: pageSize,
        locale: { code: localeCode },
    });

    return (
        <InfiniteStories
            newsroomName={languageSettings.company_information.name || newsroom.name}
            pageSize={pageSize}
            initialStories={stories}
            total={pagination.matched_records_number}
        />
    );
}
