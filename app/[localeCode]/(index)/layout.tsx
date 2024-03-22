import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { app } from '@/adapters/server';
import { Contacts } from '@/modules/Contacts';
import { FeaturedCategories } from '@/modules/FeaturedCategories';

interface Props {
    children: ReactNode;
    params: {
        localeCode: Locale.Code;
    };
}

export default async function HomepageLayout({ params, children }: Props) {
    const settings = await app().themeSettings();

    return (
        <>
            {children}
            <Contacts localeCode={params.localeCode} />
            {settings.show_featured_categories && (
                <FeaturedCategories localeCode={params.localeCode} />
            )}
        </>
    );
}
