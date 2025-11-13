'use client';

import type { Newsroom, NewsroomCompanyInformation, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { ExternalLink, Search } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { Link } from '@/components/Link';
import { Button } from '@/components/ui/ui/button';
import { cn } from '@/lib/utils';
import { SearchWidget } from '@/modules/Header/ui/SearchWidget';
import type { SearchSettings } from '@/types';
import { getUploadcareImage } from '@/utils';

import { Breadcrumbs } from './Breadcrumbs';

interface Props {
    localeCode: Locale.Code;
    newsroom: Newsroom;
    information: NewsroomCompanyInformation;
    className?: string;
    searchSettings?: SearchSettings;
    categories?: TranslatedCategory[];
    storyTitle?: string;
    isHomepage?: boolean;
    mainSiteUrl?: string | null;
    accentColor?: string;
    onSearchOpenChange?: (isOpen: boolean) => void;
}

export function LinearHeader({
    localeCode,
    newsroom,
    information,
    className,
    searchSettings,
    categories = [],
    storyTitle,
    isHomepage = false,
    mainSiteUrl,
    accentColor,
    onSearchOpenChange,
}: Props) {
    const newsroomName = information.name || newsroom.name;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const newsroomLogo = useMemo(
        () => (newsroom.newsroom_logo ? getUploadcareImage(newsroom.newsroom_logo) : null),
        [newsroom.newsroom_logo],
    );

    // Helper function to extract domain from URL
    const getDomainFromUrl = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            // Fallback if URL is malformed
            return url
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '')
                .split('/')[0];
        }
    };

    // Search modal handlers
    const openSearch = () => {
        setIsSearchOpen(true);
        onSearchOpenChange?.(true);
    };
    const closeSearch = () => {
        setIsSearchOpen(false);
        onSearchOpenChange?.(false);
    };

    return (
        <header
            className={cn(
                'sticky top-0 w-full backdrop-blur transition-all duration-200',
                isSearchOpen
                    ? 'z-[60] border-b-muted/30'
                    : 'z-[60] border-b bg-background/95 supports-[backdrop-filter]:bg-background/60',
                className,
            )}
        >
            <div className="flex h-14 items-center">
                {/* Logo section - aligned with sidebar width (320px = w-80) */}
                <div
                    className={cn(
                        'w-80 flex-shrink-0 px-6 flex items-center justify-between transition-all duration-200',
                        isSearchOpen ? 'border-r-muted/30' : 'border-r',
                    )}
                >
                    <Link
                        href={{ routeName: 'index', params: { localeCode } }}
                        className="flex items-center space-x-2 text-decoration-none"
                    >
                        {newsroomLogo?.cdnUrl && (
                            <Image
                                src={newsroomLogo.cdnUrl}
                                alt={newsroomName}
                                width={120}
                                height={24}
                                className="h-6 w-auto object-contain"
                                priority
                            />
                        )}
                        {!newsroom.newsroom_logo && (
                            <span className="font-bold">{newsroomName}</span>
                        )}
                    </Link>

                    {/* Search icon next to logo */}
                    {searchSettings && !newsroom.is_hub && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2"
                            aria-label="Search"
                            onClick={openSearch}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Breadcrumbs section */}
                <div className="flex-1 flex items-center justify-between px-6">
                    <Breadcrumbs
                        localeCode={localeCode}
                        categories={categories}
                        storyTitle={storyTitle}
                        isHomepage={isHomepage}
                    />

                    {/* Right side actions */}
                    <div className="flex items-center space-x-2">
                        {/* Main site link as text */}
                        {mainSiteUrl && mainSiteUrl.trim() !== '' && (
                            <a
                                href={mainSiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <span>{getDomainFromUrl(mainSiteUrl)}</span>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}

                        {/* Open app button - Linear Docs style with dynamic accent color */}
                        <a
                            href="https://rock.prezly.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                        >
                            <Button
                                variant="default"
                                size="sm"
                                className={cn(
                                    'h-8 px-3 text-sm font-medium text-white border-0 transition-all duration-200',
                                    isSearchOpen ? 'opacity-60' : 'hover:opacity-90',
                                )}
                                style={{
                                    backgroundColor: accentColor || '#2EAE67',
                                    color: '#ffffff',
                                }}
                            >
                                Open app
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            {searchSettings && (
                <SearchWidget
                    settings={searchSettings}
                    localeCode={localeCode}
                    categories={categories}
                    isOpen={isSearchOpen}
                    isSearchPage={false}
                    onClose={closeSearch}
                    newsrooms={[newsroom]}
                    newsroomUuid={newsroom.uuid}
                    className="z-[70]"
                />
            )}
        </header>
    );
}
