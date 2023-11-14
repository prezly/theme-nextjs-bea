import type { ExtendedStory, StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { Content } from '@/modules/Layout';
import { Story } from '@/modules/Story';
import { app, generateStoryPageMetadata, routing } from '@/theme/server';

import { Header } from '../../Header';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story preview_uuid
    };
}

async function resolveStory(params: Props['params']) {
    const { uuid } = params;

    return (await app().story({ uuid })) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const { generateUrl } = await routing();

    return generateStoryPageMetadata({
        story: () => resolveStory(params),
        generateUrl: (_, story) => generateUrl('story', { slug: story.slug }),
        isPreview: true,
    });
}

export default async function PreviewStoryPage({ params }: Props) {
    const story = (await resolveStory(params)) as ExtendedStory; // FIXME: Avoid `as` type casting;

    return (
        <>
            <Header story={story} />
            <Content>
                <Story story={story as ExtendedStory} />
            </Content>
        </>
    );
}
