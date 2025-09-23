'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { ChevronRight, ExternalLink, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Link } from '@/components/Link';
import { Button } from '@/components/ui/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/ui/collapsible';
import { useIntercom } from '@/hooks';
import { cn } from '@/lib/utils';
import type { ListStory } from '@/types';
import { sortStoriesByTagOrder } from '@/utils';

interface Props {
    localeCode: Locale.Code;
    categories: Category[];
    translatedCategories: TranslatedCategory[];
    selectedCategorySlug?: string;
    onCategorySelect?: () => void;
    categoryStories?: Record<number, ListStory[]>;
    currentStorySlug?: string;
    isSearchOpen?: boolean;
}

export function CategorySidebar({
    localeCode,
    categories,
    translatedCategories,
    selectedCategorySlug,
    onCategorySelect,
    categoryStories = {},
    currentStorySlug,
    isSearchOpen = false,
}: Props) {
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());
    const [isHydrated, setIsHydrated] = useState(false);
    const { loadIntercom } = useIntercom();
    const searchParams = useSearchParams();

    // Check if tag display is enabled via URL parameter (for management purposes)
    const showTagInfo = searchParams.get('showTags') === 'true';

    const getCategory = useMemo(
        () => (translated: TranslatedCategory) => {
            return categories.find((category) => category.id === translated.id)!;
        },
        [categories],
    );

    // Only show featured categories - these become the main collapsible sections
    const featuredCategories = useMemo(
        () =>
            translatedCategories.filter(
                (translatedCategory) => getCategory(translatedCategory)?.is_featured,
            ),
        [translatedCategories, getCategory],
    );

    // Prevent hydration mismatch by ensuring client and server render the same initially
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Auto-expand category containing current story OR selected category
    useEffect(() => {
        if (!isHydrated || featuredCategories.length === 0) return;

        let foundCategoryId: number | null = null;

        // Case 1: We're on a story page - find category containing current story
        if (currentStorySlug) {
            featuredCategories.forEach((translatedCategory) => {
                const category = getCategory(translatedCategory);
                const categoryId = category.id;
                const stories = categoryStories[categoryId] || [];

                // Check if current story is in this category
                const storyInCategory = stories.some((story) => story.slug === currentStorySlug);

                if (storyInCategory) {
                    foundCategoryId = categoryId;
                }
            });
        }

        // Case 2: We're on a category page - find the selected category
        if (selectedCategorySlug && !foundCategoryId) {
            const selectedCategory = featuredCategories.find(
                (translatedCategory) => translatedCategory.slug === selectedCategorySlug,
            );

            if (selectedCategory) {
                foundCategoryId = getCategory(selectedCategory).id;
            }
        }

        // Only update state if we found a category and it's not already open
        if (foundCategoryId !== null) {
            const sectionKey = `category-${foundCategoryId}`;
            setOpenSections((prev) => {
                if (!prev.has(sectionKey)) {
                    return new Set([...prev, sectionKey]);
                }
                return prev;
            });
        }
    }, [
        currentStorySlug,
        selectedCategorySlug,
        isHydrated,
        featuredCategories,
        categoryStories,
        getCategory,
    ]);

    // Helper function to clean category names (remove prefix before "/")
    const getCleanCategoryName = (categoryName: string) => {
        const parts = categoryName.split(' / ');
        return parts.length > 1 ? parts[parts.length - 1] : categoryName;
    };

    const toggleSection = (categoryId: number) => {
        setOpenSections((prev) => {
            const newSet = new Set(prev);
            const sectionKey = `category-${categoryId}`;
            if (newSet.has(sectionKey)) {
                newSet.delete(sectionKey);
            } else {
                newSet.add(sectionKey);
            }
            return newSet;
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header - removed Help Center title */}

            {/* Tag info indicator (for management purposes) */}
            {showTagInfo && (
                <div className="px-4 pt-2 pb-1">
                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-dashed">
                        📋 Tag info visible - Stories sorted by tags (#1, #2, #3...)
                    </div>
                </div>
            )}

            {/* Navigation - Linear Docs style */}
            <nav className="flex-1 pt-6 px-4 pb-4 space-y-1">
                {/* Featured Categories as main collapsible sections (Linear style) */}
                {featuredCategories.map((translatedCategory) => {
                    const category = getCategory(translatedCategory);
                    const categoryId = category.id;
                    const sectionKey = `category-${categoryId}`;
                    const isOpen = openSections.has(sectionKey);
                    const isActive = selectedCategorySlug === translatedCategory.slug;

                    return (
                        <Collapsible
                            key={categoryId}
                            open={isHydrated && isOpen}
                            onOpenChange={() => isHydrated && toggleSection(categoryId)}
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-between px-3 py-2 h-auto font-medium text-sm transition-colors',
                                        isActive
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                                    )}
                                >
                                    <span className="text-left">
                                        {getCleanCategoryName(translatedCategory.name)}
                                    </span>
                                    <ChevronRight
                                        className={cn(
                                            'h-4 w-4 transition-transform flex-shrink-0',
                                            isHydrated && isOpen && 'rotate-90',
                                        )}
                                    />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pl-3 pt-1">
                                {/* Show individual articles in this category (Linear Docs style) */}
                                {sortStoriesByTagOrder(categoryStories[categoryId] || []).map(
                                    (story: ListStory) => {
                                        const isCurrentStory = story.slug === currentStorySlug;

                                        return (
                                            <Link
                                                key={story.uuid}
                                                href={{
                                                    routeName: 'story',
                                                    params: { slug: story.slug },
                                                }}
                                                className={cn(
                                                    'block px-3 py-1.5 text-sm transition-colors rounded-md',
                                                    isCurrentStory
                                                        ? 'text-foreground font-medium bg-accent border-l-2 border-primary'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                                                )}
                                                onClick={onCategorySelect}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="truncate">{story.title}</span>
                                                    {showTagInfo &&
                                                        story.tags &&
                                                        story.tags.length > 0 && (
                                                            <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                {story.tags.join(', ')}
                                                            </span>
                                                        )}
                                                </div>
                                            </Link>
                                        );
                                    },
                                )}

                                {/* Show View all link only if there are more articles than displayed */}
                                {(category.i18n[localeCode]?.public_stories_number || 0) >
                                    (categoryStories[categoryId]?.length || 0) && (
                                    <Link
                                        href={{
                                            routeName: 'category',
                                            params: {
                                                localeCode,
                                                slug: translatedCategory.slug,
                                            },
                                        }}
                                        className={cn(
                                            'block px-3 py-1.5 text-sm transition-colors rounded-md font-medium mt-2 pt-2',
                                            isSearchOpen ? 'border-t-muted/30' : 'border-t',
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                                        )}
                                        onClick={onCategorySelect}
                                    >
                                        View all{' '}
                                        {category.i18n[localeCode]?.public_stories_number || 0}{' '}
                                        articles
                                    </Link>
                                )}
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}

                {/* Fallback if no featured categories */}
                {featuredCategories.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <p>No featured categories available.</p>
                        <p className="mt-2">Configure featured categories in your Prezly admin.</p>
                    </div>
                )}
            </nav>

            {/* Footer - Linear Docs style */}
            <div
                className={cn(
                    'p-4 mt-auto transition-all duration-200',
                    isSearchOpen ? 'border-t-muted/30' : 'border-t',
                )}
            >
                <div className="space-y-2">
                    {/* Prezly Developers */}
                    <a
                        href="https://developers.prezly.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-md',
                            'text-muted-foreground hover:text-foreground hover:bg-accent',
                        )}
                    >
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span>Prezly Developers</span>
                    </a>

                    {/* Contact Support */}
                    <button
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-md w-full text-left',
                            'text-muted-foreground hover:text-foreground hover:bg-accent',
                        )}
                        onClick={() => {
                            loadIntercom({
                                app_id: 'e9kdg1ld',
                                region: 'eu',
                            });
                        }}
                    >
                        <MessageCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Contact support</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
