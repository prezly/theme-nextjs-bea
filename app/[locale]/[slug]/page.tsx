import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';

interface Props {
    params: {
        locale: Locale.Code;
        slug: string;
    };
}

export default async function PublishedStoryPage({ params }: Props) {
    const { slug } = params;
    const { contentDelivery } = api();
    const story = (await contentDelivery.story({ slug })) ?? notFound();

    return (
        <div>
            Published story /{story.slug} in {story.culture.code}
        </div>
    );
}
