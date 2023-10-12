import type { Story } from '@prezly/sdk';

import { api } from '@/utils';

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
    return <div>Story page for /{story.slug}</div>;
}
