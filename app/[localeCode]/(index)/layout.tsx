import type { Locale } from '@prezly/theme-kit-nextjs';
import { type ReactNode, Suspense } from 'react';

import { Contacts } from '@/modules/Contacts';

interface Props {
    children: ReactNode;
    params: {
        localeCode: Locale.Code;
    };
}
export default function HomepageLayout({ params, children }: Props) {
    return (
        <>
            {children}
            <Suspense>
                <Contacts localeCode={params.localeCode} />
            </Suspense>
        </>
    );
}
