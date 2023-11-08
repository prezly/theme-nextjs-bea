import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { api } from '@/theme-kit';
import { generateStoryMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: string;
    };
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
    const story = await resolveStory(params);

    const translations = [story, ...story.translations].map((version) => ({
        code: version.culture.code,
        href: version.links.newsroom_view ?? (version.uuid === story.uuid ? '' : undefined), // make sure the current story language is always there
    }));

    return (
        <>
            <DeclareLanguages languages={translations} />
            <div>
                Published story /{story.slug} in {story.culture.code}
            </div>
        </>
    );
}
