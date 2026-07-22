import type { Story } from '@prezly/sdk';

import type { PublicNewsroomRef } from './sanitizeNewsroom';
import { sanitizeNewsroomRef } from './sanitizeNewsroom';

type PublicStoryBase = Pick<
    Story,
    'categories' | 'oembed' | 'published_at' | 'slug' | 'subtitle' | 'title' | 'uuid'
> & {
    links: Pick<Story['links'], 'newsroom_view'>;
    newsroom: PublicNewsroomRef;
};

export type PublicStory<T extends Story = Story> = PublicStoryBase &
    Pick<T, Extract<keyof T, 'thumbnail_image'>>;

export type PublicListStory = PublicStory<Story & Pick<Story.ExtraFields, 'thumbnail_image'>>;

export function sanitizeStories<T extends Story>(stories: T[]): PublicStory<T>[] {
    return stories.map(sanitizeStory);
}

export function sanitizeStory<T extends Story>(story: T): PublicStory<T> {
    const { categories, links, newsroom, oembed, published_at, slug, subtitle, title, uuid } =
        story;

    return {
        categories,
        links: { newsroom_view: links.newsroom_view },
        newsroom: sanitizeNewsroomRef(newsroom),
        oembed,
        published_at,
        slug,
        subtitle,
        title,
        uuid,
        ...('thumbnail_image' in story ? { thumbnail_image: story.thumbnail_image } : {}),
    } as PublicStory<T>;
}
