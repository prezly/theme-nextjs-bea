import type { ReactNode } from 'react';
import { createElement } from 'react';

import { Layout as RootLayout } from '@/theme/_layout';
import router from '@/theme/_router';

export default async function Layout(props: { children: ReactNode; params: { path?: string[] } }) {
    const { params, children } = props;
    const { path = [] } = params;

    const { match, Layout: PageLayout } = await router(path);

    if (PageLayout) {
        return createElement(PageLayout, match, children);
    }

    return createElement(RootLayout, match, children);
}
