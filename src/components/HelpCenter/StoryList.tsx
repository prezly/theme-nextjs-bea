import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { StoryCard } from '@/components/StoryCards';
import type { ListStory } from '@/types';

interface Props {
    localeCode: Locale.Code;
    stories: ListStory[];
    category?: TranslatedCategory;
    showDate?: boolean;
    showSubtitle?: boolean;
}

export function StoryList({ stories, category, showDate = true, showSubtitle = true }: Props) {
    // Helper function to clean category names (remove prefix before "/")
    const getCleanCategoryName = (categoryName: string) => {
        const parts = categoryName.split(' / ');
        return parts.length > 1 ? parts[parts.length - 1] : categoryName;
    };
    if (stories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="max-w-md mx-auto">
                    <svg
                        className="mx-auto h-12 w-12 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-semibold">
                        {category
                            ? `No articles in ${getCleanCategoryName(category.name)}`
                            : 'No articles found'}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                        {category
                            ? 'There are no articles available in this category yet.'
                            : 'There are no articles available yet.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {category && (
                <div className="border-b pb-8">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {getCleanCategoryName(category.name)}
                    </h1>
                    {category.description && (
                        <p className="mt-4 text-xl text-muted-foreground">{category.description}</p>
                    )}
                    <div className="mt-4 text-sm text-muted-foreground font-medium">
                        {stories.length} {stories.length === 1 ? 'article' : 'articles'}
                    </div>
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stories.map((story) => {
                    const { newsroom } = story;

                    return (
                        <div key={story.uuid} className="group">
                            <StoryCard
                                fallback={{
                                    image: null,
                                    text: newsroom?.name ?? 'Help Center',
                                }}
                                layout="vertical"
                                placeholder={{
                                    color: 'hsl(var(--primary))',
                                    backgroundColor: 'hsl(var(--muted))',
                                }}
                                publishedAt={story.published_at}
                                showDate={showDate}
                                showSubtitle={showSubtitle}
                                size="medium"
                                slug={story.slug}
                                subtitle={story.subtitle}
                                thumbnailImage={story.thumbnail_image}
                                title={story.title}
                                titleAsString={story.title}
                                translatedCategories={[]}
                                variant="boxed"
                                external={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
