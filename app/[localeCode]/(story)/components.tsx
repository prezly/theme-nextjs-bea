import type { ExtendedStory } from '@prezly/sdk';

import { routing } from '@/adapters/server';
import { BroadcastPreview, BroadcastStory, BroadcastTranslations } from '@/modules/Broadcast';
import { getStoryTranslationLinks } from '@/utils';

interface Props {
    story: ExtendedStory;
    isSecretStoryPage?: boolean;
}

export async function Broadcast({ story, isSecretStoryPage = false }: Props) {
    const { basePathConfig } = await routing();
    const translations = getStoryTranslationLinks(story, basePathConfig);

    return (
        <>
            <BroadcastStory story={{ id: story.id, uuid: story.uuid }} />
            <BroadcastPreview isSecretStoryPage={isSecretStoryPage} />
            <BroadcastTranslations translations={translations} />
        </>
    );
}
