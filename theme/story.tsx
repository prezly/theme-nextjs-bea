import type { Story } from '@prezly/sdk';

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
