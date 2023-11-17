import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { CookieConsent } from '@/modules/CookieConsent';
import { Layout } from '@/modules/Layout';
import { Notifications } from '@/modules/Notifications';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    header: ReactNode;
    main: ReactNode;
}

export default async function MainLayout({ header, main }: Props) {
    return (
        <>
            <Notifications />
            <CookieConsent />
            <Layout header={header}>{main}</Layout>
        </>
    );
}
