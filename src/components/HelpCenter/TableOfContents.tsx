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

    // Prevent hydration mismatch
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!content || !isHydrated) return;

        // Extract headings from the DOM after content is rendered
        const extractHeadings = () => {
            // Only select headings within the article content area, excluding H1 (main title)
            const headings = document.querySelectorAll('article h2, article h3, article h4, article h5, article h6, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
            const items: TocItem[] = [];

            headings.forEach((heading, index) => {
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
            });

            setTocItems(items);
        };

        // Wait for content to be rendered
        const timer = setTimeout(extractHeadings, 100);
        return () => clearTimeout(timer);
    }, [content, isHydrated]);

    useEffect(() => {
        if (tocItems.length === 0) return;

        const handleScroll = () => {
            // Header height + some padding
            const headerOffset = 80;
            const scrollTop = window.scrollY + headerOffset;
            
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

            // Special case: if we're at the bottom of the page, activate the last visible heading
            // BUT respect recently clicked items for a short period
            if (isAtBottom && !clickedId) {
                // Find the last heading that's visible in the viewport
                const visibleHeadings = tocItems.filter(({ id }) => {
                    const element = document.getElementById(id);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        return rect.top < window.innerHeight;
                    }
                    return false;
                });
                
                if (visibleHeadings.length > 0) {
                    currentActiveId = visibleHeadings[visibleHeadings.length - 1].id;
                }
            }

            // If we have a recently clicked item, use that instead
            if (clickedId) {
                currentActiveId = clickedId;
            }

            // If no heading is above the current scroll position, use the first one
            if (!currentActiveId && tocItems.length > 0) {
                currentActiveId = tocItems[0].id;
            }

            if (currentActiveId && currentActiveId !== activeId) {
                setActiveId(currentActiveId);
            }
        };

        // Initial call
        handleScroll();

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
    }, [tocItems, activeId, clickedId, clickTimeout]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Clear any existing timeout
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }

            // Immediately set as active and mark as clicked
            setActiveId(id);
            setClickedId(id);
            
            // Get the element's position
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            
            // Account for sticky header height (56px = h-14) plus some padding
            const headerOffset = 80;
            
            // Scroll to the position minus the offset
            window.scrollTo({
                top: elementPosition - headerOffset,
                behavior: 'smooth'
            });

            // Clear the clicked state after 2 seconds to allow normal scroll detection
            const timeout = setTimeout(() => {
                setClickedId('');
                setClickTimeout(null);
            }, 2000);
            
            setClickTimeout(timeout);
        }
    };

    if (tocItems.length === 0) return null;

    return (
        <div className={cn("space-y-2", className)}>
            <h4 className="font-semibold text-sm text-foreground mb-4">On This Page</h4>
            <nav className="space-y-1">
                {tocItems.map(({ id, text, level }) => (
                    <button
                        key={id}
                        onClick={() => scrollToHeading(id)}
                        className={cn(
                            "block text-left text-sm transition-colors hover:text-foreground w-full",
                            activeId === id
                                ? "text-foreground font-medium border-l-2 border-primary bg-muted/50 pl-3 py-1"
                                : "text-muted-foreground hover:text-foreground pl-3 py-1",
                            level > 2 && "pl-6",
                            level > 3 && "pl-9",
                            level > 4 && "pl-12"
                        )}
                    >
                        {text}
                    </button>
                ))}
            </nav>
        </div>
    );
}
