import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';
import { PageTitle } from '@/components/PageTitle';
import type { ThemeSettings } from '@/theme-settings';

import { InfiniteStories } from '../InfiniteStories';

import styles from './Tag.module.scss';

interface Props {
    tag: string;
    locale: Locale.Code;
    layout: ThemeSettings['layout'];
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export async function Tag({
    tag,
    locale,
    layout,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
}: Props) {
    const { stories, pagination } = await app().stories({
        limit: pageSize,
        locale: { code: locale },
        tags: [tag],
    });

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(locale);

    return (
        <>
            <PageTitle className={styles.pageTitle} title={tag} />
            <InfiniteStories
                tag={tag}
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
