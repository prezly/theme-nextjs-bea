import { Elements } from '@prezly/content-renderer-react-js';
import type { Story } from '@prezly/sdk';
import { type Locale, translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/server';
import { Divider } from '@/components/Divider';

interface Props {
    locale: Locale.Code;
    stories: Story[];
}

export function RelatedStories({ locale, stories }: Props) {
    return (
        <>
            <Divider />
            <h2>
                <FormattedMessage for={translations.homepage.latestStories} locale={locale} />
            </h2>

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
