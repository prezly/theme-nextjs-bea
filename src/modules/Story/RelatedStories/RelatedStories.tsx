import { Elements } from '@prezly/content-renderer-react-js';
import type { Story } from '@prezly/sdk';

import { Divider } from '@/components/Divider';

interface Props {
    stories: Story[];
}

export function RelatedStories({ stories }: Props) {
    return (
        <>
            <Divider />
            <h2>Latest News</h2>

            <div>
                {stories.map((story) => (
                    <Elements.StoryBookmark
                        key={story.uuid}
                        node={{
                            story: { uuid: story.uuid },
                            show_thumbnail: true,
                            layout: 'horizontal',
                            new_tab: false,
                            type: 'story-bookmark',
                            uuid: story.uuid,
                        }}
                        storyOEmbedInfo={story.oembed}
                    />
                ))}
            </div>
        </>
    );
}
