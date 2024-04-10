import type { ExtendedStory } from '@prezly/sdk';
import { Notification } from '@prezly/sdk';

import { BroadcastNotifications, BroadcastStory, BroadcastTranslations } from '@/modules/Broadcast';

interface Props {
    story: ExtendedStory;
    isPreview?: boolean;
}

const PREVIEW_WARNING: Notification = {
    id: 'preview-warning',
    type: 'preview-warning',
    style: Notification.Style.WARNING,
    title: 'This is a preview with a temporary URL which will change after publishing.',
    description: '',
    actions: [],
};

export function Broadcast({ story, isPreview }: Props) {
    const translations = [story, ...story.translations].map((version) => ({
        code: version.culture.code,
        href: version.links.newsroom_view ?? (version.uuid === story.uuid ? '' : undefined), // make sure the current story language is always there
    }));

    return (
        <>
            <BroadcastStory story={story} />
            {isPreview && <BroadcastNotifications notifications={[PREVIEW_WARNING]} />}
            <BroadcastTranslations translations={translations} />
        </>
    );
}
