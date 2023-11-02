import type { Router } from './createRouter';
import type { Route } from './route';

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
          ...params: Routes[RouteName] extends Route<infer Match>
              ? {} extends Match
                  ? [WithLocaleCode<Match>] | [Match] | []
                  : [WithLocaleCode<Match>] | [Match]
              : never
      ) => string
    : never;
