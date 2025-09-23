'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/ui/button';
import { ScrollArea } from '@/components/ui/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { SearchSettings } from '@/types';

import { CategorySidebar } from './CategorySidebar';
import { LinearHeader } from './LinearHeader';
import { TableOfContents } from './TableOfContents';

interface Props {
    localeCode: Locale.Code;
    categories: Category[];
    translatedCategories: TranslatedCategory[];
    children: ReactNode;
    selectedCategorySlug?: string;
    showTableOfContents?: boolean;
    content?: string;
    newsroom?: any;
    information?: any;
    searchSettings?: SearchSettings;
    categoryStories?: Record<number, any[]>;
    breadcrumbCategories?: TranslatedCategory[];
    storyTitle?: string;
    isHomepage?: boolean;
    mainSiteUrl?: string | null;
    accentColor?: string;
    currentStorySlug?: string;
}

export function HelpCenterLayout({
    localeCode,
    categories,
    translatedCategories,
    children,
    selectedCategorySlug,
    showTableOfContents = false,
    content,
    newsroom,
    information,
    searchSettings,
    categoryStories = {},
    breadcrumbCategories = [],
    storyTitle,
    isHomepage = false,
    mainSiteUrl,
    accentColor,
    currentStorySlug,
}: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [selectedCategorySlug]);

    return (
        <div className="min-h-screen bg-background">
            {/* Linear-style Header */}
            {newsroom && information && (
                <LinearHeader
                    localeCode={localeCode}
                    newsroom={newsroom}
                    information={information}
                    searchSettings={searchSettings}
                    categories={breadcrumbCategories}
                    storyTitle={storyTitle}
                    isHomepage={isHomepage}
                    mainSiteUrl={mainSiteUrl}
                    accentColor={accentColor}
                    onSearchOpenChange={setIsSearchOpen}
                />
            )}

            <div className="flex min-h-[calc(100vh-3.5rem)]">
                {/* Mobile menu button */}
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        'fixed top-16 left-4 z-50 md:hidden',
                        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                    )}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>

                {/* Left Sidebar - Navigation - Fixed/Sticky */}
                <aside
                    className={cn(
                        'fixed top-14 bottom-0 left-0 z-[60] w-80 backdrop-blur transition-all duration-200',
                        'transform transition-transform duration-300 ease-in-out',
                        isSearchOpen
                            ? 'border-r-muted/30'
                            : 'border-r bg-background/95 supports-[backdrop-filter]:bg-background/60',
                        isHydrated && isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                        'md:translate-x-0', // Always visible on desktop
                    )}
                >
                    <ScrollArea className="h-full">
                        <CategorySidebar
                            localeCode={localeCode}
                            categories={categories}
                            translatedCategories={translatedCategories}
                            selectedCategorySlug={selectedCategorySlug}
                            onCategorySelect={() => setIsSidebarOpen(false)}
                            categoryStories={categoryStories}
                            currentStorySlug={currentStorySlug}
                            isSearchOpen={isSearchOpen}
                        />
                    </ScrollArea>
                </aside>

                {/* Main content area - positioned next to fixed sidebar */}
                <div className="flex-1 flex min-w-0 ml-0 md:ml-80">
                    {/* Article content - centered between sidebars */}
                    <main
                        className={cn(
                            'flex-1 min-w-0 flex justify-center',
                            showTableOfContents ? 'max-w-none' : 'max-w-6xl mx-auto',
                        )}
                    >
                        <div
                            className={cn(
                                'w-full px-6 py-8 md:px-8 lg:py-12',
                                showTableOfContents ? 'max-w-5xl xl:px-12' : 'max-w-6xl',
                            )}
                        >
                            {children}
                        </div>
                    </main>

                    {/* Right Sidebar - Table of Contents - Sticky */}
                    {showTableOfContents && (
                        <aside className="hidden xl:block w-80 flex-shrink-0">
                            <div className="sticky top-20 p-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
                                <TableOfContents content={content} />
                            </div>
                        </aside>
                    )}
                </div>

                {/* Overlay for mobile */}
                {isHydrated && isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                setIsSidebarOpen(false);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label="Close sidebar"
                    />
                )}
            </div>
        </div>
    );
}
