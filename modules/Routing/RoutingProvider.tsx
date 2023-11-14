import type { ReactNode } from 'react';

import { RoutingContextProvider } from '@/theme/client';
import { app, routing } from '@/theme/server';

interface Props {
    children: ReactNode;
}

export async function RoutingProvider({ children }: Props) {
    const { router } = await routing();
    const locales = await app().locales();
    const defaultLocale = await app().defaultLocale();

    return (
        <RoutingContextProvider
            routes={router.dump()}
            locales={locales}
            defaultLocale={defaultLocale}
        >
            {children}
        </RoutingContextProvider>
    );
}
