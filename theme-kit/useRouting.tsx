'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import UrlPattern from 'url-pattern';

import type { UrlGenerator } from './router';
import type { configureAppRouter } from './routing';

export type { UrlGeneratorParams } from './router';

export type AppRouter = ReturnType<typeof configureAppRouter>;
type AppRoutes = AppRouter['routes'];
type AppRoutesMap = ReturnType<AppRouter['dump']>;

const context = createContext<AppRoutesMap | undefined>(undefined);

export function RoutingContextProvider(props: { routes: AppRoutesMap; children: ReactNode }) {
    return <context.Provider value={props.routes}>{props.children}</context.Provider>;
}

export function useRouting(): { generateUrl: UrlGenerator<AppRouter> } {
    const routes = useContext(context);

    if (!routes) {
        throw new Error(
            '`useRouting()` requires a RoutingContext defined above the tree, but there is no context provided.',
        );
    }

    const generateUrl = (routeName: keyof AppRoutes, params?: Record<string, unknown>) => {
        const pattern = new UrlPattern(routes[routeName]);
        return pattern.stringify(params);
    };

    return {
        generateUrl: generateUrl as UrlGenerator<AppRouter>,
    };
}
