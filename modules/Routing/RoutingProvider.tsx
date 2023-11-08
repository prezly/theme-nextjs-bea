import type { ReactNode } from 'react';

import { routing } from '@/theme-kit';
import { RoutingContextProvider } from '@/theme-kit/useRouting';

interface Props {
    children: ReactNode;
}

export async function RoutingProvider({ children }: Props) {
    const { router } = await routing();

    return <RoutingContextProvider routes={router.dump()}>{children}</RoutingContextProvider>;
}
