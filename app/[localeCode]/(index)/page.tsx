import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { api } from '@/theme-kit';
import { generateHomepageMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export function generateMetadata({ params }: Props): Promise<Metadata> {
    return generateHomepageMetadata({
        localeCode: params.localeCode,
    });
}

function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default async function StoriesIndexPage({ params }: Props) {
    const { contentDelivery } = api();
    const { stories } = await contentDelivery.stories({
        pageSize: 10,
        locale: { code: params.localeCode },
    });

    await delay(5000);

    return (
        <ul>
            {stories.map((story) => (
                <li key={story.uuid}>
                    <a href={`/${story.slug}`}>{story.title}</a>
                </li>
            ))}
        </ul>
    );
}
