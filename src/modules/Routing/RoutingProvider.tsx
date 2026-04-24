import type { ReactNode } from 'react';

import { BasePathProvider, RoutingContextProvider } from '@/adapters/client';
import { app, routing } from '@/adapters/server';

interface Props {
    children: ReactNode;
}

export async function RoutingProvider({ children }: Props) {
    const { router, basePathConfig } = await routing();
    const locales = await app().locales();
    const defaultLocale = await app().defaultLocale();

    return (
        <BasePathProvider config={basePathConfig}>
            <RoutingContextProvider
                routes={router.dump()}
                locales={locales}
                defaultLocale={defaultLocale}
            >
                {children}
            </RoutingContextProvider>
        </BasePathProvider>
    );
}
