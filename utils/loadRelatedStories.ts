import type { Story } from '@prezly/sdk';
import { getPrezlyApi } from '@prezly/theme-kit-nextjs';
import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

export async function loadRelatedStories(
    context: GetStaticPropsContext | GetServerSidePropsContext,
    story: Story | undefined,
) {
    const category = story?.categories[0];

    if (!category) {
        return null;
    }

    const api = getPrezlyApi('req' in context ? context.req : undefined);

    const { stories } = await api.getStoriesFromCategory(category, { pageSize: 50 });

    return stories;
}
