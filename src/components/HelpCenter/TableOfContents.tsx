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

        const observerOptions = {
            rootMargin: '-20% 0% -35% 0%',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, observerOptions);

        tocItems.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [tocItems]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
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
