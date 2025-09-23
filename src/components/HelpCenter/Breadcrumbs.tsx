'use client';

import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { ChevronRight, Home } from 'lucide-react';

import { Link } from '@/components/Link';
import { cn } from '@/lib/utils';

interface Props {
    localeCode: Locale.Code;
    categories?: TranslatedCategory[];
    storyTitle?: string;
    isHomepage?: boolean;
    className?: string;
}

export function Breadcrumbs({
    localeCode,
    categories = [],
    storyTitle,
    isHomepage = false,
    className,
}: Props) {
    // Helper function to clean category names (remove prefix before "/")
    const getCleanCategoryName = (categoryName: string) => {
        const parts = categoryName.split(' / ');
        return parts.length > 1 ? parts[parts.length - 1] : categoryName;
    };
    return (
        <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
            {/* Home link */}
            <Link
                href={{ routeName: 'index', params: { localeCode } }}
                className="flex items-center hover:text-foreground transition-colors text-decoration-none"
            >
                <Home className="h-4 w-4 mr-1" />
                <span>Home</span>
            </Link>

            {/* Show categories and story title only if not homepage */}
            {!isHomepage && (
                <>
                    {/* Categories */}
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-1">
                            <ChevronRight className="h-4 w-4" />
                            <Link
                                href={{
                                    routeName: 'category',
                                    params: {
                                        localeCode,
                                        slug: category.slug,
                                    },
                                }}
                                className="hover:text-foreground transition-colors text-decoration-none"
                            >
                                {getCleanCategoryName(category.name)}
                            </Link>
                        </div>
                    ))}

                    {/* Story title */}
                    {storyTitle && (
                        <div className="flex items-center space-x-1">
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground font-medium truncate">
                                {storyTitle}
                            </span>
                        </div>
                    )}
                </>
            )}
        </nav>
    );
}
