import type { ExtendedStory, StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { Content } from '@/modules/Layout';
import { Story } from '@/modules/Story';
import { api } from '@/theme/server';
import { generateStoryMetadata } from '@/theme-kit/metadata';

import { Header } from '../../Header';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story secret_uuid
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
