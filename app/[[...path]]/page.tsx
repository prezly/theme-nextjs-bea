import { createElement } from 'react';

import router from '@/theme/_router';

export default async function Page(props: { params: { path?: string[] } }) {
    const { path = [] } = props.params;

    const { match, Page: PageComponent } = await router(path);

    return createElement(PageComponent, match);
}
