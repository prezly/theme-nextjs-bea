import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';

interface Props {
    params: {
        locale: Locale.Code;
        uuid: string;
    };
}

export default async function SecretStoryPage({ params }: Props) {
    const { uuid } = params;
    const { contentDelivery } = api();
    const story = (await contentDelivery.story({ uuid })) ?? notFound();

    return (
        <div>
            Secret story URL #{story.uuid} in {story.culture.code}
        </div>
    );
}
