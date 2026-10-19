import type { ExtendedStory } from '@prezly/sdk';

import { routing } from '@/adapters/server';
import { BroadcastPreview, BroadcastStory, BroadcastTranslations } from '@/modules/Broadcast';
import { applyBasePathAbsolute } from '@/utils';

interface Props {
    story: ExtendedStory;
    isSecretStoryPage?: boolean;
}

export async function Broadcast({ story, isSecretStoryPage = false }: Props) {
    const { basePathConfig } = await routing();
    const translations = [story, ...story.translations].map((version) => ({
        code: version.culture.code,
        // `newsroom_view` is backend-owned: give it the public origin and path
        // prefix when configured (a no-op otherwise).
        href: version.links.newsroom_view
            ? applyBasePathAbsolute(
                  version.links.newsroom_view,
                  basePathConfig,
                  version.culture.code,
              )
            : version.uuid === story.uuid
              ? '' // make sure the current story language is always there
              : undefined,
    }));

    return (
        <>
            <BroadcastStory story={{ id: story.id, uuid: story.uuid }} />
            <BroadcastPreview isSecretStoryPage={isSecretStoryPage} />
            <BroadcastTranslations translations={translations} />
        </>
    );
}
