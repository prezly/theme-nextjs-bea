'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import UrlPattern from 'url-pattern';

import type { UrlGenerator } from './router';
import type { configureAppRouter } from './routing';

type Router = ReturnType<typeof configureAppRouter>;
type Routes = Router['routes'];
type RoutesMap = ReturnType<Router['dump']>;

const context = createContext<RoutesMap | undefined>(undefined);

export function RoutingContextProvider(props: { routes: RoutesMap; children: ReactNode }) {
    return <context.Provider value={props.routes}>{props.children}</context.Provider>;
}

export function useRouting(): { generateUrl: UrlGenerator<Router> } {
    const routes = useContext(context);

    if (!routes) {
        throw new Error(
            '`useRouting()` requires a RoutingContext defined above the tree, but there is no context provided.',
        );
    }

    return {
        generateUrl(routeName: keyof Routes, params?: Record<string, unknown>) {
            const pattern = new UrlPattern(routes[routeName]);
            return pattern.stringify(params);
        },
    };
}
