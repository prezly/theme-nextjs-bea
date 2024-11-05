import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { Tag as TagIndexPage } from '@/modules/Tag';
import { getStoryListPageSize, parsePreviewSearchParams } from 'utils';

interface Props {
    params: {
        localeCode: Locale.Code;
        tag: NonNullable<string>;
    };
    searchParams: Record<string, string>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { generateUrl } = await routing();
    const { localeCode, tag } = params;

    return generatePageMetadata({
        locale: localeCode,
        title: tag.charAt(0).toUpperCase() + tag.slice(1),
        generateUrl: (locale) => generateUrl('tag', { localeCode: locale, tag }),
    });
}

export default async function TagPage({ params, searchParams }: Props) {
    const themeSettings = await app().themeSettings();
    const settings = parsePreviewSearchParams(searchParams, themeSettings);

    return (
        <TagIndexPage
            locale={params.localeCode}
            tag={params.tag}
            layout={settings.layout}
            pageSize={getStoryListPageSize(settings.layout)}
            showDate={settings.show_date}
            showSubtitle={settings.show_subtitle}
            storyCardVariant={settings.story_card_variant}
        />
    );
}
