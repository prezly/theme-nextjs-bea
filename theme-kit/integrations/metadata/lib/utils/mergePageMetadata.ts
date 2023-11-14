/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Metadata } from 'next';

export function mergePageMetadata(...metadatas: Metadata[]): Metadata {
    return metadatas.reduce((merged, metadata) => merge(merged, metadata), {});
}

function merge(a: Metadata, b: Metadata): Metadata {
    if (Object.keys(a).length === 0) {
        return b;
    }

    if (Object.keys(b).length === 0) {
        return a;
    }

    return {
        ...withoutUndefined(a),
        ...withoutUndefined(b),
        robots: mergeRobots(a.robots, b.robots),
        alternates: mergeAlternates(a.alternates, b.alternates),
        openGraph: {
            ...withoutUndefined(a.openGraph ?? {}),
            ...withoutUndefined(b.openGraph ?? {}),
        },
        twitter: {
            ...withoutUndefined(a.twitter ?? {}),
            ...withoutUndefined(b.twitter ?? {}),
        },
        verification: {
            ...withoutUndefined(a.verification ?? {}),
            ...withoutUndefined(b.verification ?? {}),
        },
        other: {
            ...withoutUndefined(a.other ?? {}),
            ...withoutUndefined(b.other ?? {}),
        },
    };
}

function mergeRobots(a: Metadata['robots'], b: Metadata['robots']): Metadata['robots'] {
    if (a && typeof a === 'object' && b && typeof b === 'object') {
        return {
            ...withoutUndefined(a),
            ...withoutUndefined(b),
        };
    }

    return b || a;
}

function mergeAlternates(
    a: Metadata['alternates'],
    b: Metadata['alternates'],
): Metadata['alternates'] {
    return {
        ...withoutUndefined(a ?? {}),
        ...withoutUndefined(b ?? {}),
        media: {
            ...withoutUndefined(a?.media ?? {}),
            ...withoutUndefined(b?.media ?? {}),
        },
        types: {
            ...withoutUndefined(a?.types ?? {}),
            ...withoutUndefined(b?.types ?? {}),
        },
    };
}

function withoutUndefined<T extends {}>(input: T): T {
    return Object.fromEntries(
        Object.entries(input).filter(([, propValue]) => propValue !== undefined),
    ) as T;
}
