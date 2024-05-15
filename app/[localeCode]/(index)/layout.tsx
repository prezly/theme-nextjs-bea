import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { Contacts } from '@/modules/Contacts';
import { FeaturedCategories } from '@/modules/FeaturedCategories';

interface Props {
    children: ReactNode;
    params: {
        localeCode: Locale.Code;
    };
}

export default async function HomepageLayout({ params, children }: Props) {
    return (
        <>
            {children}
            <Contacts localeCode={params.localeCode} />
            <FeaturedCategories localeCode={params.localeCode} />
        </>
    );
}
