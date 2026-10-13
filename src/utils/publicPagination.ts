import { DEFAULT_GALLERY_PAGE_SIZE, type Locale } from '@prezly/theme-kit-nextjs';

export const MAX_PUBLIC_PAGE_SIZE = 20;
export const DEEP_OFFSET_THRESHOLD = 1000;
const MAX_API_INTEGER = 2_147_483_647;

export type PublicListKind = 'stories' | 'hub-stories' | 'galleries';
export interface PublicListParams {
    limit: number;
    offset: number;
    locale?: Locale.Code;
    category?: number;
    tag?: string;
}

export class PublicListInputError extends Error {}

export function parsePublicListParams(
    params: URLSearchParams,
    kind: PublicListKind,
): PublicListParams {
    const allowed = new Set(['limit', 'offset']);
    if (kind !== 'galleries') allowed.add('locale');
    if (kind === 'stories') {
        allowed.add('category');
        allowed.add('tag');
        allowed.add('query');
    }
    for (const key of params.keys()) {
        if (!allowed.has(key) || params.getAll(key).length !== 1) {
            throw new PublicListInputError('Unsupported or repeated query parameter.');
        }
    }

    const locale = params.get('locale') || undefined;
    const tag = params.get('tag') || undefined;
    const query = params.get('query');
    if (query) validateLegacyExclusion(query);
    if (
        tag &&
        (Array.from(tag).length > 255 ||
            !tag.trim() ||
            Array.from(tag).some((character) => {
                const code = character.codePointAt(0) ?? 0;
                return code < 32 || code === 127;
            }))
    ) {
        throw new PublicListInputError('Invalid tag.');
    }
    return {
        limit:
            integer(params.get('limit'), 1, MAX_PUBLIC_PAGE_SIZE) ??
            (kind === 'galleries' ? DEFAULT_GALLERY_PAGE_SIZE : MAX_PUBLIC_PAGE_SIZE),
        offset: integer(params.get('offset'), 0, MAX_API_INTEGER) ?? 0,
        locale: locale ? parseLocale(locale) : undefined,
        category: integer(params.get('category'), 1, MAX_API_INTEGER),
        tag,
    };
}

function integer(value: string | null, min: number, max: number) {
    if (value === null || value === '') return undefined;
    const number = Number(value);
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(number) || number < min || number > max) {
        throw new PublicListInputError('Invalid pagination or category value.');
    }
    return number;
}

function validateLegacyExclusion(value: string) {
    // Already-loaded UI builds send this one-featured-story exclusion, which
    // the API has always ignored. Keep that bounded no-op through rollouts;
    // never interpret arbitrary SDK queries or include it in a cache key.
    try {
        if (value.length > 256) throw new Error();
        const query = JSON.parse(value);
        const excluded = query?.uuid?.$nin;
        if (
            Object.keys(query).join() !== 'uuid' ||
            Object.keys(query.uuid).join() !== '$nin' ||
            !Array.isArray(excluded) ||
            excluded.length !== 1 ||
            typeof excluded[0] !== 'string' ||
            !/^[a-z0-9_-]{1,64}$/i.test(excluded[0])
        ) {
            throw new Error();
        }
    } catch {
        throw new PublicListInputError('Unsupported query filter.');
    }
}

function parseLocale(value: string): Locale.Code {
    const match = /^([a-z]{2,3})(?:[-_]([a-z]{4}))?(?:[-_]([a-z]{2}|\d{3}))?$/i.exec(value);
    if (!match) throw new PublicListInputError('Invalid locale.');
    const [, language, script, region] = match;
    return [
        language.toLowerCase(),
        script ? script[0].toUpperCase() + script.slice(1).toLowerCase() : undefined,
        region?.toUpperCase(),
    ]
        .filter(Boolean)
        .join('_') as Locale.Code;
}
