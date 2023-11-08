/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ExtendedStory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { DEFAULT_THEME_SETTINGS } from '@/modules/Head/branding/defaults';
import { Story } from '@/modules/Story';
import { api } from '@/theme-kit';
import { generateStoryMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: string;
    };
    searchParams: Record<string, string>;
}

async function resolveStory(params: Props['params']) {
    const { slug } = params;
    const { contentDelivery } = api();

    return (await contentDelivery.story({ slug })) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const story = await resolveStory(params);

    return generateStoryMetadata({ story });
}

export default async function StoryPage({ params }: Props) {
    const { contentDelivery } = api();

    const story = (await resolveStory(params)) as ExtendedStory; // FIXME: Avoid `as` type casting
    const theme = await contentDelivery.theme();

    const settings = {
        ...DEFAULT_THEME_SETTINGS, // FIXME: Introduce a helper function for this
        ...(theme?.settings ?? {}),
    };

    return (
        <>
            <DeclareStoryLanguages story={story} />
            <Story story={story as ExtendedStory} settings={settings} />
        </>
    );
}

function DeclareStoryLanguages(props: { story: ExtendedStory }) {
    const { story } = props;

    const translations = [story, ...story.translations].map((version) => ({
        code: version.culture.code,
        href: version.links.newsroom_view ?? (version.uuid === story.uuid ? '' : undefined), // make sure the current story language is always there
    }));

    return <DeclareLanguages languages={translations} />;
}
