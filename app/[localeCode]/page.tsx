import type { Locale } from '@prezly/theme-kit-intl';

import { api, routing } from '@/theme-kit';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export default async function StoriesIndexPage({ params }: Props) {
    const { contentDelivery } = api();
    const { generateUrl } = routing();
    const { stories } = await contentDelivery.stories({
        pageSize: 10,
        locale: { code: params.localeCode },
    });

    return (
        <ul>
            {stories.map((story) => (
                <li key={story.uuid}>
                    <a href={generateUrl('story', story)}>{story.title}</a>
                </li>
            ))}
        </ul>
    );
}
