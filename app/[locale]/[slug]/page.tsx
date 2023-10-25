import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';

interface Params {
    locale: string;
    slug: string;
}

export default async function PublishedStoryPage(props: { params: Params }) {
    const { slug } = props.params;
    const { contentDelivery } = api();
    const story = (await contentDelivery.story({ slug })) ?? notFound();

    return (
        <div>
            Published story /{story.slug} in {story.culture.code}
        </div>
    );
}
