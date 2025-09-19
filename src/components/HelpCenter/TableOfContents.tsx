'use client';

import { useEffect, useState } from 'react';
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
                        const elementPosition = currentElement.getBoundingClientRect().top + window.pageYOffset;
                        const headerOffset = 80;
                        
                        // Only scroll if we're not already at the right position
                        const currentScroll = window.pageYOffset;
                        const targetScroll = elementPosition - headerOffset;
                        
                        if (Math.abs(currentScroll - targetScroll) > 50) {
                            window.scrollTo({
                                top: targetScroll,
                                behavior: attempt === 0 ? 'auto' : 'smooth' // First attempt is instant
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
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    const headerOffset = 80;
                    window.scrollTo({
                        top: elementPosition - headerOffset,
                        behavior: 'smooth'
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
            const headings = document.querySelectorAll('article h2, article h3, article h4, article h5, article h6, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
            const items: TocItem[] = [];

            headings.forEach((heading) => {
                const level = parseInt(heading.tagName.charAt(1));
                const text = heading.textContent || '';
                let id = heading.id;

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
                        const elementPosition = heading.getBoundingClientRect().top + window.pageYOffset;
                        const headerOffset = 80;
                        const targetScrollY = elementPosition - headerOffset;
                        
                        // Store the target scroll position
                        setLastScrollY(targetScrollY);
                        
                        window.scrollTo({
                            top: targetScrollY,
                            behavior: 'smooth'
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
    }, [content, isHydrated]);

    useEffect(() => {
        if (tocItems.length === 0 || !isHydrated) return;

        const handleScroll = () => {
            // Header height + some padding
            const headerOffset = 80;
            const scrollTop = window.scrollY + headerOffset;
            
            // Check if user has manually scrolled after clicking (higher threshold)
            const currentScrollY = window.scrollY;
            if (clickedId && Math.abs(currentScrollY - lastScrollY) > 200) {
                setHasScrolledAfterClick(true);
            }
            
            // Check if we're at the bottom of the page
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

            // Find the heading that's currently at the top
            let currentActiveId = '';
            let closestDistance = Infinity;

            tocItems.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) {
                    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
                    const distance = Math.abs(scrollTop - elementTop);
                    
                    // If this element is above the scroll position and closer than the previous closest
                    if (elementTop <= scrollTop && distance < closestDistance) {
                        closestDistance = distance;
                        currentActiveId = id;
                    }
                }
            });

            // ABSOLUTE PRIORITY: If we have a recently clicked item and user hasn't scrolled manually, use that instead
            if (clickedId && !hasScrolledAfterClick) {
                currentActiveId = clickedId;
                // EARLY RETURN - don't run any other logic
            } else if (isAtBottom) {
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

            // If no heading is above the current scroll position, use the first one
            if (!currentActiveId && tocItems.length > 0) {
                currentActiveId = tocItems[0].id;
            }

            if (currentActiveId && currentActiveId !== activeId) {
                setActiveId(currentActiveId);
                // Update URL when scrolling changes active heading, but respect user's explicit clicks
                if (!clickedId && isHydrated) {
                    // No recent click - normal auto-update
                    updateUrl(currentActiveId);
                } else if (clickedId && hasScrolledAfterClick && isHydrated) {
                    // User clicked and then scrolled manually - resume auto-updates
                    updateUrl(currentActiveId);
                } else if (clickedId && !hasScrolledAfterClick && isHydrated) {
                    // User clicked but hasn't scrolled - keep the clicked URL
                    // Don't update URL, preserve user's explicit choice
                }
            }
        };

        // Initial call (delayed to ensure hydration is complete)
        setTimeout(handleScroll, 0);

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
    }, [tocItems, activeId, clickedId, clickTimeout, hasScrolledAfterClick, lastScrollY, isHydrated]);

    // Function to update URL with hash
    const updateUrl = (id: string) => {
        if (!isHydrated) return;
        const url = new URL(window.location.href);
        url.hash = id;
        window.history.replaceState({}, '', url.toString());
    };

    const scrollToHeading = (id: string) => {
        if (!isHydrated) return;
        const element = document.getElementById(id);
        if (element) {
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
                behavior: 'smooth'
            });

            // Clear the clicked state after 5 seconds to allow normal scroll detection
            const timeout = setTimeout(() => {
                setClickedId('');
                setHasScrolledAfterClick(false);
                setClickTimeout(null);
            }, 5000);
            
            setClickTimeout(timeout);
        }
    };

    // Don't render anything until after hydration to prevent hydration mismatches
    if (!isHydrated) {
        return (
            <div className={cn("space-y-2", className)}>
                <h4 className="font-semibold text-sm text-foreground mb-4">On This Page</h4>
                <nav className="space-y-1">
                    {/* Placeholder during SSR */}
                </nav>
            </div>
        );
    }

    if (tocItems.length === 0) return null;

    return (
        <div className={cn("space-y-2", className)}>
            <h4 className="font-semibold text-sm text-foreground mb-4">On This Page</h4>
            <nav className="space-y-1">
                {tocItems.map(({ id, text, level }) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToHeading(id);
                        }}
                        className={cn(
                            "block text-left text-sm transition-colors hover:text-foreground w-full no-underline",
                            isHydrated && activeId === id
                                ? "text-foreground font-medium border-l-2 border-primary bg-muted/50 pl-3 py-1"
                                : "text-muted-foreground hover:text-foreground pl-3 py-1",
                            level > 2 && "pl-6",
                            level > 3 && "pl-9",
                            level > 4 && "pl-12"
                        )}
                    >
                        {text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
