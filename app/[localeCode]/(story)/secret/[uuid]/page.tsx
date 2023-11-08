import type { Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';
import { generateStoryMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: Story['uuid']; // story secret_uuid
    };
}

async function resolveStory(params: Props['params']) {
    const { uuid } = params;
    const { contentDelivery } = api();

    return (await contentDelivery.story({ uuid })) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const story = await resolveStory(params);

    return generateStoryMetadata({ story, isSecret: true });
}

export default async function SecretStoryPage({ params }: Props) {
    const story = await resolveStory(params);

    return (
        <div>
            Secret story URL #{story.uuid} in {story.culture.code}
        </div>
    );
}
