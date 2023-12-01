import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';
import { cache } from 'react';

import { app } from '@/adapters/server';
import { getLanguageSettings, getNewsroom } from '@/utils/cachedData';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    localeCode: Locale.Code;
    pageSize: number;
}

const getStories = cache((params: ContentDelivery.stories.SearchParams) => app().stories(params));

export async function Stories({ localeCode, pageSize }: Props) {
    const newsroom = await getNewsroom();
    const languageSettings = await getLanguageSettings(localeCode);
    const { stories, pagination } = await getStories({
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
