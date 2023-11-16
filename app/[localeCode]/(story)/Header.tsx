import type { ExtendedStory } from '@prezly/sdk';
import { Notification } from '@prezly/sdk';

import { BroadcastNotifications } from '@/modules/BroadcastNotifications';
import { Header as LayoutHeader } from '@/modules/Header';

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

export function Header({ story, isPreview }: Props) {
    const translations = [story, ...story.translations].map((version) => ({
        code: version.culture.code,
        href: version.links.newsroom_view ?? (version.uuid === story.uuid ? '' : undefined), // make sure the current story language is always there
    }));

    return (
        <>
            {isPreview && <BroadcastNotifications notifications={[PREVIEW_WARNING]} />}
            <LayoutHeader languages={translations} />
        </>
    );
}
