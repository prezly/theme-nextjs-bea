import type { Story, StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Stories } from '@prezly/theme-kit-nextjs';

import { applyBasePathAbsolute, type BasePathConfig } from './basePath';

export interface StoryTranslationLink {
    code: Locale.Code;
    href: string | undefined;
}

type LinkedStory = Pick<StoryRef, 'uuid' | 'culture' | 'links'>;

/**
 * Lists the language versions of a story the language switcher can link to:
 * the story itself and its publicly published translations.
 */
export function getStoryTranslationLinks(
    story: LinkedStory & Pick<Story, 'translations'>,
    basePathConfig: BasePathConfig,
): StoryTranslationLink[] {
    const versions: LinkedStory[] = [story, ...Stories.getPublicTranslations(story)];

    return versions.map((version) => ({
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
}
