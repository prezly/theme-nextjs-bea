import type { Story, StoryRef, UserRef } from '@prezly/sdk';

import type { PublicNewsroomRef } from './sanitizeNewsroom';
import { sanitizeNewsroomRef } from './sanitizeNewsroom';

export type PublicUserRef = Pick<
    UserRef,
    'avatar_url' | 'display_name' | 'email' | 'first_name' | 'last_name'
>;

export type PublicStoryRef = Omit<StoryRef, 'author' | 'newsroom'> & {
    author: PublicUserRef | null;
    newsroom: PublicNewsroomRef;
};

export type PublicStory<T extends Story = Story> = Omit<
    T,
    'author' | 'newsroom' | 'pinned_by' | 'translations'
> & {
    author: PublicUserRef | null;
    newsroom: PublicNewsroomRef;
    pinned_by: PublicUserRef | null;
    translations: PublicStoryRef[];
};

export type PublicListStory = PublicStory<Story & Pick<Story.ExtraFields, 'thumbnail_image'>>;

export function sanitizeStories<T extends Story>(stories: T[]): PublicStory<T>[] {
    return stories.map(sanitizeStory);
}

export function sanitizeStory<T extends Story>(story: T): PublicStory<T> {
    const { author, newsroom, pinned_by, translations, ...rest } = story;

    return {
        ...rest,
        author: sanitizeUserRef(author),
        newsroom: sanitizeNewsroomRef(newsroom),
        pinned_by: sanitizeUserRef(pinned_by),
        translations: translations.map(sanitizeStoryRef),
    };
}

function sanitizeStoryRef(story: StoryRef): PublicStoryRef {
    const { author, newsroom, ...rest } = story;

    return {
        ...rest,
        author: sanitizeUserRef(author),
        newsroom: sanitizeNewsroomRef(newsroom),
    };
}

export function sanitizeUserRef(user: UserRef | null): PublicUserRef | null {
    if (!user) {
        return null;
    }

    const { avatar_url, display_name, email, first_name, last_name } = user;

    return { avatar_url, display_name, email, first_name, last_name };
}
