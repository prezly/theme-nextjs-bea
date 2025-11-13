'use client';

import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface Props {
    content?: string;
    className?: string;
}

export function TableOfContents({ content, className }: Props) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isHydrated, setIsHydrated] = useState(false);
    const [clickedId, setClickedId] = useState<string>('');
    const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
    const [hasScrolledAfterClick, setHasScrolledAfterClick] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // Function to update URL with hash (only used for clicks, not scrolling)
    const updateUrl = useCallback(
        (id: string) => {
            if (!isHydrated) return;
            const url = new URL(window.location.href);
            url.hash = id;
            window.history.replaceState({}, '', url.toString());
        },
        [isHydrated],
    );

    // Prevent hydration mismatch
    useEffect(() => {
        setIsHydrated(true);
        // Initialize scroll position after hydration
        if (typeof window !== 'undefined') {
            setLastScrollY(window.scrollY);
        }
    }, []);

    // Handle initial hash navigation after content is loaded
    useEffect(() => {
        if (!isHydrated || tocItems.length === 0) return;

        // Check for hash in URL on initial load
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            const element = document.getElementById(hash);
            if (element) {
                // Set active immediately
                setActiveId(hash);

                // Multiple attempts to scroll in case content is still loading
                const scrollToHash = (attempt = 0) => {
                    const currentElement = document.getElementById(hash);
                    if (currentElement && attempt < 5) {
                        const elementPosition =
                            currentElement.getBoundingClientRect().top + window.pageYOffset;
                        const headerOffset = 80;

                        // Only scroll if we're not already at the right position
                        const currentScroll = window.pageYOffset;
                        const targetScroll = elementPosition - headerOffset;

                        if (Math.abs(currentScroll - targetScroll) > 50) {
                            window.scrollTo({
                                top: targetScroll,
                                behavior: attempt === 0 ? 'auto' : 'smooth', // First attempt is instant
                            });
                        }

                        // Retry after a delay if needed
                        if (attempt < 4) {
                            setTimeout(() => scrollToHash(attempt + 1), 200 * (attempt + 1));
                        }
                    }
                };

                // Start scrolling attempts
                setTimeout(() => scrollToHash(0), 100);
            }
        }
    }, [isHydrated, tocItems]);

    // Listen for hash changes (browser back/forward, manual URL changes)
    useEffect(() => {
        if (!isHydrated) return;

        const handleHashChange = () => {
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                const element = document.getElementById(hash);
                if (element) {
                    setActiveId(hash);
                    const elementPosition =
                        element.getBoundingClientRect().top + window.pageYOffset;
                    const headerOffset = 80;
                    window.scrollTo({
                        top: elementPosition - headerOffset,
                        behavior: 'smooth',
                    });
                }
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        // Also listen for window load as a fallback
        const handleWindowLoad = () => {
            if (window.location.hash) {
                setTimeout(() => handleHashChange(), 500);
            }
        };

        window.addEventListener('load', handleWindowLoad);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('load', handleWindowLoad);
        };
    }, [isHydrated]);

    useEffect(() => {
        if (!content || !isHydrated) return;

        // Store event listeners for cleanup
        const eventListeners = new Map<Element, () => void>();

        // Extract headings from the DOM after content is rendered
        const extractHeadings = () => {
            // Only select headings within the article content area, excluding H1 (main title)
            const headings = document.querySelectorAll(
                'article h2, article h3, article h4, article h5, article h6, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6',
            );
            const items: TocItem[] = [];

            headings.forEach((heading) => {
                const level = Number.parseInt(heading.tagName.charAt(1), 10);
                const { textContent } = heading;
                const text = textContent || '';
                let { id } = heading;

                // Skip if this heading is likely a main title, site title, or navigation
                if (text === 'Help Center' || level === 1 || text.trim() === '') {
                    return;
                }

                // Generate ID if not present
                if (!id) {
                    id = text
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim();

                    // Ensure uniqueness
                    let uniqueId = id;
                    let counter = 1;
                    while (document.getElementById(uniqueId)) {
                        uniqueId = `${id}-${counter}`;
                        counter++;
                    }

                    heading.id = uniqueId;
                    id = uniqueId;
                }

                items.push({ id, text, level });

                // Add click handler to heading for URL updates (only after hydration)
                if (isHydrated) {
                    (heading as HTMLElement).style.cursor = 'pointer';

                    const clickHandler = () => {
                        // Clear any existing timeout
                        if (clickTimeout) {
                            clearTimeout(clickTimeout);
                        }

                        // Set as active and mark as clicked (same as TOC clicks)
                        setActiveId(id);
                        setClickedId(id);
                        setHasScrolledAfterClick(false); // Reset scroll tracking
                        updateUrl(id);

                        // Scroll to the clicked heading (same logic as TOC clicks)
                        const elementPosition =
                            heading.getBoundingClientRect().top + window.pageYOffset;
                        const headerOffset = 80;
                        const targetScrollY = elementPosition - headerOffset;

                        // Store the target scroll position
                        setLastScrollY(targetScrollY);

                        window.scrollTo({
                            top: targetScrollY,
                            behavior: 'smooth',
                        });

                        // Clear the clicked state after 5 seconds to allow normal scroll detection
                        const timeout = setTimeout(() => {
                            setClickedId('');
                            setHasScrolledAfterClick(false);
                            setClickTimeout(null);
                        }, 5000);

                        setClickTimeout(timeout);
                    };

                    heading.addEventListener('click', clickHandler);
                    eventListeners.set(heading, clickHandler);
                }
            });

            setTocItems(items);
        };

        // Wait for content to be rendered
        const timer = setTimeout(extractHeadings, 100);

        return () => {
            clearTimeout(timer);
            // Clean up event listeners (only if they were added after hydration)
            if (isHydrated) {
                eventListeners.forEach((handler, heading) => {
                    heading.removeEventListener('click', handler);
                });
                eventListeners.clear();
            }
        };
    }, [content, isHydrated, clickTimeout, updateUrl]);

    useEffect(() => {
        if (tocItems.length === 0 || !isHydrated) return;

        const handleScroll = () => {
            // If we're currently clicking, completely ignore all scroll events
            if (isClicking) {
                return;
            }

            // Mark as initialized on first scroll, but don't block the logic
            if (!hasInitialized) {
                setHasInitialized(true);
            }

            // Header height + some padding
            const headerOffset = 80;
            const scrollTop = window.scrollY + headerOffset;

            // Check if user has manually scrolled after clicking
            const currentScrollY = window.scrollY;
            if (clickedId && Math.abs(currentScrollY - lastScrollY) > 30) {
                setHasScrolledAfterClick(true);
                // Clear the clickedId when user manually scrolls
                setClickedId('');
                setClickTimeout(null);
            }

            // Check if we're at the bottom of the page
            const isAtBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

            // Find the heading that's currently at the top
            let currentActiveId = '';
            let closestDistance = Number.POSITIVE_INFINITY;

            tocItems.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + window.pageYOffset;

                    // Check if the element is above the current scroll position
                    if (elementTop <= scrollTop) {
                        const distance = Math.abs(scrollTop - elementTop);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            currentActiveId = id;
                        }
                    }
                }
            });

            // ABSOLUTE PRIORITY: If we have a recently clicked item and user hasn't scrolled manually, use that instead
            if (clickedId && !hasScrolledAfterClick) {
                currentActiveId = clickedId;
                // Don't update anything else, just return early
                if (currentActiveId && currentActiveId !== activeId) {
                    setActiveId(currentActiveId);
                }
                return; // EARLY RETURN - don't run any other logic
            }

            if (isAtBottom) {
                // Special case: if we're at the bottom of the page, activate the last visible heading
                // Only apply this if no recent click or user has scrolled after clicking
                const visibleHeadings = tocItems.filter(({ id }) => {
                    const element = document.getElementById(id);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        return rect.top < window.innerHeight;
                    }
                    return false;
                });

                if (visibleHeadings.length > 0) {
                    const bottomId = visibleHeadings[visibleHeadings.length - 1].id;
                    currentActiveId = bottomId;
                }
            }

            // If we're at the very top of the page, clear everything
            if (window.scrollY <= 50) {
                currentActiveId = '';
                // Clear the URL hash when at the top (only for clicks, not scroll)
                if (window.location.hash) {
                    const url = new URL(window.location.href);
                    url.hash = '';
                    window.history.replaceState({}, '', url.toString());
                }
            }

            if (currentActiveId && currentActiveId !== activeId) {
                setActiveId(currentActiveId);
                // No URL updating on scroll - only visual highlighting
            } else if (!currentActiveId && activeId) {
                // Clear active state when no heading should be active
                setActiveId('');
            }
        };

        // Initial call (delayed to ensure hydration is complete)
        setTimeout(handleScroll, 50);

        // Also call immediately to ensure highlighting works
        setTimeout(handleScroll, 200);

        // Throttle scroll events for performance
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll);
        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
        };
    }, [
        tocItems,
        activeId,
        clickedId,
        clickTimeout,
        hasScrolledAfterClick,
        lastScrollY,
        isHydrated,
        isClicking,
        hasInitialized,
    ]);

    const scrollToHeading = (id: string) => {
        if (!isHydrated) return;
        const element = document.getElementById(id);
        if (element) {
            // Set clicking state to block all scroll detection
            setIsClicking(true);

            // Clear any existing timeout
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }

            // Immediately set as active and mark as clicked
            setActiveId(id);
            setClickedId(id);
            setHasScrolledAfterClick(false); // Reset scroll tracking

            // Update URL with hash
            updateUrl(id);

            // Get the element's position
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;

            // Account for sticky header height (56px = h-14) plus some padding
            const headerOffset = 80;
            const targetScrollY = elementPosition - headerOffset;

            // Store the target scroll position
            setLastScrollY(targetScrollY);

            // Scroll to the position minus the offset
            window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth',
            });

            // Clear clicking state after scroll completes, but keep clickedId until user scrolls
            setTimeout(() => {
                setIsClicking(false);
                // Don't clear clickedId here - let it persist until user actually scrolls
            }, 500);
        }
    };

    // Don't render anything until after hydration to prevent hydration mismatches
    if (!isHydrated) {
        return (
            <div className={cn('space-y-2', className)}>
                <h4 className="font-semibold text-sm text-foreground mb-4">On This Page</h4>
                <nav className="space-y-1">{/* Placeholder during SSR */}</nav>
            </div>
        );
    }

    if (tocItems.length === 0) return null;

    return (
        <div className={cn('space-y-2', className)}>
            <h4 className="font-semibold text-sm text-foreground mb-4">On This Page</h4>
            <nav className="space-y-1">
                {tocItems.map(({ id, text, level }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => scrollToHeading(id)}
                        className={cn(
                            'block text-left text-sm transition-colors hover:text-foreground w-full no-underline border-none bg-transparent cursor-pointer',
                            isHydrated && activeId === id
                                ? 'text-foreground font-medium border-l-2 border-primary bg-muted/50 pl-3 py-1'
                                : 'text-muted-foreground hover:text-foreground pl-3 py-1',
                            level > 2 && 'pl-6',
                            level > 3 && 'pl-9',
                            level > 4 && 'pl-12',
                        )}
                    >
                        {text}
                    </button>
                ))}
            </nav>
        </div>
    );
}
