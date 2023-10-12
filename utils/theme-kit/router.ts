/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/naming-convention */

import type { Culture } from '@prezly/sdk';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import UrlPattern from 'url-pattern';

import { assertServerEnv } from '../assertServerEnv';

import { api } from './api';

export function route<
    Pattern extends `/${string}`,
    Match extends ExtractPathParams<Pattern>,
    Props = Match,
>(pattern: Pattern, loader: Loader<Match, Props>) {
    const urlPattern = buildUrlPattern(pattern);

    return {
        async match(path: string, getDefaultLocale, isEnabledLocale) {
            const matched = urlPattern.match(path);

            if (!matched) {
                return undefined;
            }

            if (matched.locale && !(await isEnabledLocale(matched.locale))) {
                return undefined;
            }

            if (!matched.locale) {
                matched.locale = await getDefaultLocale();
            }

            const { match: pageMatch, resolveLocale, Layout, default: Page } = await loader();

            const pageMatched = pageMatch ? await pageMatch(matched) : matched;

            if (!pageMatched) {
                return undefined;
            }

            if (resolveLocale) {
                return {
                    match: {
                        ...pageMatched,
                        locale: await resolveLocale(pageMatched),
                        Layout,
                        Page,
                    },
                };
            }

            return {
                match: { ...pageMatched, locale: matched.locale ?? (await getDefaultLocale()) },
                Layout,
                Page,
            };
        },
    } as Route<Match, Props | Match>;
}

type Route<Match, Props> = {
    match(
        path: string,
        getDefaultLocale: () => Promise<string>,
        isEnabledLocale: (locale: string) => Promise<boolean>,
    ): Promise<
        | {
              match: Match;
              Layout?: ServerComponentType<Props>;
              Page: ServerComponentType<Props>;
          }
        | undefined
    >;
};

export async function match(path: string | string[], routes: Route<any, any>[]) {
    assertServerEnv('match');

    const { contentDelivery } = api();

    async function getDefaultLocale() {
        return (await contentDelivery.language())!.locale.code;
    }

    async function isEnabledLocale(locale: string) {
        return contentDelivery.language(locale).then(Boolean);
    }

    const stringPath = typeof path === 'string' ? path : `/${path.join('/')}`;
    const matches = await Promise.all(
        routes.map((r) => r.match(stringPath, getDefaultLocale, isEnabledLocale)),
    );

    const [first] = matches.filter(Boolean);

    if (!first) {
        notFound();
    }

    return first;
}

function buildUrlPattern(pattern: string) {
    return new UrlPattern(pattern.replace(/\[\[(\w+)]]/g, '(:$1)').replace(/\[(\w+)]/g, ':$1'));
}

type Loader<Match, Props> = () => Promise<PageModule<Match, Props>>;

type WithLocale<T> = T & { locale: Culture['code'] };

interface MarkupOnlyPageModule<Match> {
    match?: never;
    resolveLocale?: (match: Match) => OptionalPromise<Culture['code']>;
    Layout?: ServerComponentType<WithLocale<Match>>;
    default: ServerComponentType<WithLocale<Match>>;
}

interface MatchPageModule<Match, Props> {
    match: (match: Match) => OptionalPromise<false | null | undefined | Props>;
    resolveLocale?: (props: Props) => OptionalPromise<Culture['code']>;
    Layout?: ServerComponentType<WithLocale<Props>>;
    default: ServerComponentType<WithLocale<Props>>;
}

type PageModule<Match, Props> = MarkupOnlyPageModule<Match> | MatchPageModule<Match, Props>;

type ServerComponentType<Props> = (props: Props) => OptionalPromise<ReactElement | null>;

type Exact<T extends Record<string, unknown>> = { [K in keyof T]: T[K] };

type ExtractPathParams<T extends string> = string extends T
    ? Exact<{}>
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends `${infer _Start}[${infer Param}]/${infer Rest}`
    ? { [k in Param | keyof ExtractPathParams<Rest>]: string }
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends `${infer _Start}[${infer Param}]`
    ? { [k in Param]: string }
    : {};

type OptionalPromise<T> = T | Promise<T> | PromiseLike<T>;
