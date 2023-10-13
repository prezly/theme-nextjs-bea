import type { Culture, Story } from '@prezly/sdk';
import type { ReactNode } from 'react';

import { api } from '@/theme-kit';

type Match = { slug: string } | { uuid: string };

export async function match(params: Match) {
    const { contentDelivery } = api();

    const story = await contentDelivery.story(params);

    return story && { story };
}

export function resolveLocale({ story }: Props) {
    return story.culture.code;
}

interface Props {
    story: Story;
}

export default async function Page({ story }: Props) {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();

    return (
        <div>
            <h1>{newsroom.display_name}</h1>
            <h2>Story: {story.title}</h2>
        </div>
    );
}

export async function Layout(props: {
    children: ReactNode;
    locale: Culture['code'];
    story: Story;
}) {
    return (
        <html lang={props.locale}>
            <body>
                <h1>Story layout</h1>
                {props.children}
            </body>
        </html>
    );
}
