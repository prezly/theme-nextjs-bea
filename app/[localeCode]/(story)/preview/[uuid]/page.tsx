import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';
import { generateStoryMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: Story['uuid'];
    };
}

async function resolveStory(params: Props['params']) {
    const { uuid } = params;
    const { contentDelivery } = api();

    return (await contentDelivery.story({ uuid })) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const story = await resolveStory(params);

    return generateStoryMetadata({ story, isPreview: true });
}

export default async function StoryPreviewPage({ params }: Props) {
    const story = await resolveStory(params);

    return (
        <div>
            Preview story URL #{story.uuid} in {story.culture.code}
        </div>
    );
}
