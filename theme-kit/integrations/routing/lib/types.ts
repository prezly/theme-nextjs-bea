import type { Locale } from '@prezly/theme-kit-intl';

export interface Router<Routes extends RoutesMap = RoutesMap> {
    routes: Routes;

    match(
        path: string,
        searchParams: URLSearchParams,
    ): {
        [RouteName in keyof Routes]: Routes[RouteName] extends Route<string, infer Match>
            ? Promise<
                  | { params: Match & { localeCode: Locale.Code }; route: Route<string, Match> }
                  | undefined
              >
            : undefined;
    }[keyof Routes];

    generate<RouteName extends keyof Routes>(
        routeName: RouteName,
        ...params: Routes[RouteName] extends Route<string, infer Match>
            ? {} extends Match
                ? [Match] | []
                : [Match]
            : never
    ): `/${string}`;

    dump(): {
        [RouteName in keyof Routes]: Routes[RouteName]['pattern'];
    };
}

export type RoutesMap<T extends Route = Route> = Record<string, T>;

export type Route<Pattern = string, Match = unknown> = {
    pattern: Pattern;
    match(
        path: string,
        searchParams: URLSearchParams,
        context: MatchContext,
    ): Promise<(Match & { localeCode: Locale.Code }) | undefined>;
    generate(params: Match): `/${string}`;
    rewrite(params: Match & { localeCode: Locale.Code }): string;
};

export interface MatchContext {
    getDefaultLocale(): Awaitable<Locale.Code>;
    resolveLocaleSlug(localeSlug: Locale.AnySlug): Awaitable<Locale.Code | undefined>;
}

export type Awaitable<T> = T | Promise<T> | PromiseLike<T>;

export type ExtractPathParams<T extends string> =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends `${infer _Start}(/:${infer Param})/${infer Rest}`
        ? { [k in Param]?: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(:${infer Param})/${infer Rest}`
        ? { [k in Param]?: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [k in Param]: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(/:${infer Param})`
        ? { [k in Param]?: string }
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(:${infer Param})`
        ? { [k in Param]?: string }
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}:${infer Param}`
        ? { [k in Param]: string }
        : unknown;

type WithLocaleCode<T> = T extends { localeSlug: string }
    ? Omit<T, 'localeSlug'> & { localeCode: string }
    : T extends { localeSlug?: string }
    ? Omit<T, 'localeSlug'> & { localeCode?: string }
    : T;

/**
 * Construct a type based on `Router.generate()`, but:
 * - required `localeSlug` can be replaced with required `localeCode`
 * - optional `localeSlug` can be replaced with optional `localeCode`
 */
export type UrlGenerator<T> = T extends Router<infer Routes>
    ? <RouteName extends keyof Routes>(
          routeName: RouteName,
          ...params: Routes[RouteName] extends Route<string, infer Match>
              ? {} extends Match
                  ? [WithLocaleCode<Match>] | [Match] | []
                  : [WithLocaleCode<Match>] | [Match]
              : never
      ) => `/${string}`
    : never;

export type UrlGeneratorParams<T> = T extends Router<infer Routes>
    ? {
          [RouteName in keyof Routes]: Routes[RouteName] extends Route<string, infer Match>
              ? {} extends Match
                  ? { routeName: RouteName; params?: WithLocaleCode<Match> | Match }
                  : { routeName: RouteName; params: WithLocaleCode<Match> | Match }
              : never;
      }[keyof Routes]
    : never;
