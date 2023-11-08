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

    const translations = story.translations.map((translation) => ({
        code: translation.culture.code,
        href: translation.links.newsroom_view,
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
