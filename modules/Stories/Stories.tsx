import type { StoryWithImage } from 'types';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    newsroomName: string;
    initialStories: StoryWithImage[];
    pageSize: number;
    total: number;
    showDates: boolean;
    showSubtitles: boolean;
}

export function Stories({
    newsroomName,
    initialStories,
    pageSize,
    total,
    showDates,
    showSubtitles,
}: Props) {
    return (
        <InfiniteStories
            newsroomName={newsroomName}
            initialStories={initialStories}
            pageSize={pageSize}
            total={total}
            showDates={showDates}
            showSubtitles={showSubtitles}
        />
    );
}
