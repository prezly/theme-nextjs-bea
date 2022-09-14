import Link from 'next/link';
import type { ReactNode } from 'react';

import { InnerContainer, OuterContainer } from '@/components/TailwindSpotlight/Container';

interface NavLinkProps {
    href: string;
    children: ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
    return (
        <Link href={href} className="transition hover:text-rose-500 dark:hover:text-rose-400">
            {children}
        </Link>
    );
}

export function Footer() {
    return (
        <footer className="mt-32">
            <OuterContainer>
                <div className="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
                    <InnerContainer>
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <div className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                <NavLink href="/about">About</NavLink>
                                <NavLink href="/projects">Articles</NavLink>
                                <NavLink href="/speaking">Stuff I write about</NavLink>
                                <NavLink href="/speaking">How I built this blog</NavLink>
                                <NavLink href="/uses">Uses</NavLink>
                            </div>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500">
                                &copy; {new Date().getFullYear()} Lifelog.be. All rights reserved.
                            </p>
                        </div>
                    </InnerContainer>
                </div>
            </OuterContainer>
        </footer>
    );
}
