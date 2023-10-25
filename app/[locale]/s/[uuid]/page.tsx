import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';

interface Params {
    locale: string;
    uuid: string;
}

export default async function SecretStoryPage(props: { params: Params }) {
    const { uuid } = props.params;
    const { contentDelivery } = api();
    const story = (await contentDelivery.story({ uuid })) ?? notFound();

    return (
        <div>
            Secret story URL #{story.uuid} in {story.culture.code}
        </div>
    );
}
