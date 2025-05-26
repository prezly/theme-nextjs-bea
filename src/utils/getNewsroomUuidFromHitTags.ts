const NEWSROOM_UUID_TAG_PREFIX = 'newsroom_uuid_';

export function getNewsroomUuidFromHitTags(tags: string[]): string | undefined {
    return tags
        .find((tag) => tag.startsWith(NEWSROOM_UUID_TAG_PREFIX))
        ?.replace(NEWSROOM_UUID_TAG_PREFIX, '');
}
