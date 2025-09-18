'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import { FileText, Folder, ChevronRight, ExternalLink, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ListStory } from '@/types';

import { FormattedMessage } from '@/adapters/client';
import { Link } from '@/components/Link';
import { 
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/ui/collapsible';
import { Button } from '@/components/ui/ui/button';
import { cn } from '@/lib/utils';

interface Props {
    localeCode: Locale.Code;
    categories: Category[];
    translatedCategories: TranslatedCategory[];
    selectedCategorySlug?: string;
    onCategorySelect?: () => void;
    categoryStories?: Record<number, ListStory[]>;
}

export function CategorySidebar({
    localeCode,
    categories,
    translatedCategories,
    selectedCategorySlug,
    onCategorySelect,
    categoryStories = {},
}: Props) {
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());
    const [isHydrated, setIsHydrated] = useState(false);

    // Prevent hydration mismatch by ensuring client and server render the same initially
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const getCategory = (translated: TranslatedCategory) => {
        return categories.find((category) => category.id === translated.id)!;
    };

    // Only show featured categories - these become the main collapsible sections
    const featuredCategories = translatedCategories.filter(
        (translatedCategory) => getCategory(translatedCategory)?.is_featured,
    );

    // Helper function to clean category names (remove prefix before "/")
    const getCleanCategoryName = (categoryName: string) => {
        const parts = categoryName.split(' / ');
        return parts.length > 1 ? parts[parts.length - 1] : categoryName;
    };

    const toggleSection = (categoryId: number) => {
        setOpenSections(prev => {
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
                                        "w-full justify-between px-3 py-2 h-auto font-medium text-sm transition-colors",
                                        isActive 
                                            ? "bg-accent text-accent-foreground" 
                                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <span className="text-left">{getCleanCategoryName(translatedCategory.name)}</span>
                                    <ChevronRight className={cn(
                                        "h-4 w-4 transition-transform flex-shrink-0",
                                        isHydrated && isOpen && "rotate-90"
                                    )} />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pl-3 pt-1">
                                {/* Show individual articles in this category (Linear Docs style) */}
                                {categoryStories[categoryId]?.map((story) => (
                                    <Link
                                        key={story.uuid}
                                        href={{ routeName: 'story', params: { localeCode, slug: story.slug } }}
                                        className={cn(
                                            "block px-3 py-1.5 text-sm transition-colors rounded-md",
                                            "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}
                                        onClick={onCategorySelect}
                                    >
                                        <span className="truncate">{story.title}</span>
                                    </Link>
                                ))}
                                
                                {/* Show View all link only if there are more articles than displayed */}
                                {(category.i18n[localeCode]?.public_stories_number || 0) > (categoryStories[categoryId]?.length || 0) && (
                                    <Link
                                        href={{
                                            routeName: 'category',
                                            params: {
                                                localeCode,
                                                slug: translatedCategory.slug,
                                            },
                                        }}
                                        className={cn(
                                            "block px-3 py-1.5 text-sm transition-colors rounded-md font-medium border-t mt-2 pt-2",
                                            isActive 
                                                ? "bg-primary text-primary-foreground" 
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}
                                        onClick={onCategorySelect}
                                    >
                                        View all {category.i18n[localeCode]?.public_stories_number || 0} articles
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
            <div className="border-t p-4 mt-auto">
                <div className="space-y-2">
                    {/* Prezly Developers */}
                    <a
                        href="https://developers.prezly.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-md",
                            "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                    >
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span>Prezly Developers</span>
                    </a>

                    {/* Contact Support */}
                    <button
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-md w-full text-left",
                            "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                        onClick={() => {
                            // TODO: Implement Intercom chat integration
                            console.log('Contact support clicked - Intercom integration needed');
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