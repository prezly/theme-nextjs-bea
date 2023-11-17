import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { Layout } from '@/modules/Layout';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    header: ReactNode;
    main: ReactNode;
}

export default async function MainLayout({ header, main }: Props) {
    return <Layout header={header}>{main}</Layout>;
}
