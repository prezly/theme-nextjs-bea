import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: string;
    };
}

export default async function PreviewStoryPage({ params }: Props) {
    const { uuid } = params;
    const { contentDelivery } = api();
    const story = (await contentDelivery.story({ uuid })) ?? notFound();

    return (
        <div>
            Preview story URL #{story.uuid} in {story.culture.code}
        </div>
    );
}
