import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';

import { Layout } from '@/modules/Layout';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    children: ReactNode;
}

export default async function SearchLayout({ children }: Props) {
    return <Layout>{children}</Layout>;
}
