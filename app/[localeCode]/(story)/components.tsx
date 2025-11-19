import type { ExtendedStory } from '@prezly/sdk';

import { BroadcastPreview, BroadcastStory, BroadcastTranslations } from '@/modules/Broadcast';

interface Props {
    story: ExtendedStory;
    isSecretStoryPage?: boolean;
}

export function Broadcast({ story, isSecretStoryPage = false }: Props) {
    const translations = [story, ...story.translations].map((version) => ({
        code: version.culture.code,
        href: version.links.newsroom_view ?? (version.uuid === story.uuid ? '' : undefined), // make sure the current story language is always there
    }));

    return (
        <>
            <BroadcastStory story={story} />
            <BroadcastPreview isSecretStoryPage={isSecretStoryPage} />
            <BroadcastTranslations translations={translations} />
        </>
    );
}
