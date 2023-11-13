import type { ReactNode } from 'react';

import { RoutingContextProvider } from '@/theme/client';
import { routing } from '@/theme/server';

interface Props {
    children: ReactNode;
}

export async function RoutingProvider({ children }: Props) {
    const { router } = await routing();

    return <RoutingContextProvider routes={router.dump()}>{children}</RoutingContextProvider>;
}
