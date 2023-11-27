import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    localeCode: Locale.Code;
    pageSize: number;
}

export async function Stories({ localeCode, pageSize }: Props) {
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);
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
