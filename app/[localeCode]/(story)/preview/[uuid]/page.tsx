import type { ExtendedStory, StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { DEFAULT_THEME_SETTINGS } from '@/modules/Head/branding/defaults';
import { Story } from '@/modules/Story';
import { api } from '@/theme-kit';
import { generateStoryMetadata } from '@/theme-kit/metadata';

import { DeclareStoryLanguages } from '../../DeclareStoryLanguages';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story preview_uuid
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

export default async function PreviewStoryPage({ params }: Props) {
    const { contentDelivery } = api();

    const story = (await resolveStory(params)) as ExtendedStory; // FIXME: Avoid `as` type casting;
    const theme = await contentDelivery.theme();
    // FIXME: Introduce a helper function for this
    const settings = {
        ...DEFAULT_THEME_SETTINGS,
        ...(theme?.settings ?? {}),
    };

    return (
        <>
            <DeclareStoryLanguages story={story} />
            <Story story={story as ExtendedStory} settings={settings} />
        </>
    );
}
