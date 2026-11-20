import { expect, test } from '@playwright/test';
import { Story } from '@prezly/sdk';
import type { StoryRef } from '@prezly/sdk';

import { getStoryTranslationLinks } from '../src/utils/storyTranslations';

function version(
    code: string,
    status: Story.Status = Story.Status.PUBLISHED,
    visibility: Story.Visibility = Story.Visibility.PUBLIC,
    newsroomView: string | null = `https://example.com/${code}/story`,
) {
    return {
        uuid: `story-${code}`,
        culture: { code },
        status,
        visibility,
        links: { newsroom_view: newsroomView },
    } as StoryRef;
}

function story(translations: StoryRef[], current: StoryRef = version('en')) {
    return { ...current, translations };
}

test('links to the story and its publicly published translations', () => {
    expect(getStoryTranslationLinks(story([version('fr'), version('de')]), {})).toEqual([
        { code: 'en', href: 'https://example.com/en/story' },
        { code: 'fr', href: 'https://example.com/fr/story' },
        { code: 'de', href: 'https://example.com/de/story' },
    ]);
});

test('leaves out translations that are not publicly published', () => {
    const translations = [
        version('fr', Story.Status.DRAFT, Story.Visibility.PUBLIC, null),
        version('de', Story.Status.SCHEDULED, Story.Visibility.PUBLIC, null),
        version('es', Story.Status.EMBARGO, Story.Visibility.EMBARGO),
        version('nl', Story.Status.PUBLISHED, Story.Visibility.PRIVATE),
        version(
            'it',
            Story.Status.PUBLISHED,
            Story.Visibility.CONFIDENTIAL,
            'https://example.com/s/secret-uuid',
        ),
        version('pt'),
    ];

    expect(getStoryTranslationLinks(story(translations), {})).toEqual([
        { code: 'en', href: 'https://example.com/en/story' },
        { code: 'pt', href: 'https://example.com/pt/story' },
    ]);
});

test('keeps the current story when it is not public itself', () => {
    const current = version(
        'en',
        Story.Status.PUBLISHED,
        Story.Visibility.CONFIDENTIAL,
        'https://example.com/s/secret-uuid',
    );

    expect(getStoryTranslationLinks(story([version('fr')], current), {})).toEqual([
        { code: 'en', href: 'https://example.com/s/secret-uuid' },
        { code: 'fr', href: 'https://example.com/fr/story' },
    ]);
});

test('keeps the current story language when the story has no public URL yet', () => {
    const current = version('en', Story.Status.DRAFT, Story.Visibility.PUBLIC, null);

    expect(getStoryTranslationLinks(story([], current), {})).toEqual([{ code: 'en', href: '' }]);
});

test('applies the reverse proxy prefix to translation links', () => {
    const links = getStoryTranslationLinks(story([version('fr')]), { basePath: '/press' });

    expect(links).toEqual([
        { code: 'en', href: 'https://example.com/press/en/story' },
        { code: 'fr', href: 'https://example.com/press/fr/story' },
    ]);
});
