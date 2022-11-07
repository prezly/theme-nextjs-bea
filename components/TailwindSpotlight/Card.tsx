import classNames from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface ClassNameProps {
    className?: string;
}

interface CardProps {
    className?: string;
    children?: ReactNode;
}

interface HrefProps {
    href?: string;
    children?: ReactNode;
}

interface ChildrenProps {
    children: ReactNode;
}

function ChevronRightIcon({ className }: ClassNameProps) {
    return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
            <path
                d="M6.75 5.75 9.25 8l-2.5 2.25"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function Card({ className, children }: CardProps) {
    return (
        <article className={classNames(className, 'group relative flex flex-col items-start')}>
            {children}
        </article>
    );
}

Card.Link = function CardLink({ children, href }: HrefProps) {
    return (
        <>
            <div className="absolute -inset-y-6 -inset-x-4 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl" />

            {href && (
                <Link href={href}>
                    <span className="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                    <span className="relative z-10">{children}</span>
                </Link>
            )}
        </>
    );
};

Card.Title = function CardTitle({ href, children }: HrefProps) {
    return (
        <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            {href ? <Card.Link href={href}>{children}</Card.Link> : children}
        </h2>
    );
};

Card.Description = function CardDescription({ children }: ChildrenProps) {
    return (
        <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">{children}</p>
    );
};

Card.Cta = function CardCta({ children }: ChildrenProps) {
    return (
        <div
            aria-hidden="true"
            className="relative z-10 mt-4 flex items-center text-sm font-medium text-rose-500"
        >
            {children}
            <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" />
        </div>
    );
};

Card.CategoryLink = function CardCta({ href, children }: HrefProps) {
    const hrefRss = `/${href ?? ''}/feed`;

    return (
        <div className="flex mt-4">
            <Link href={href ?? ''}>
                <div className="z-10 flex items-center text-sm font-medium text-rose-500">
                    {children}
                    <ChevronRightIcon className="mr-1 h-4 w-4 stroke-current" />
                    Read Category
                </div>
            </Link>
            <Link href={hrefRss}>
                <div className="z-10 ml-4 flex items-center text-sm font-medium text-rose-500">
                    {children}
                    <ChevronRightIcon className="mr-1 h-4 w-4 stroke-current" />
                    RSS
                </div>
            </Link>
        </div>
    );
};

interface EyeBrowProps {
    decorate: boolean;
    className?: string;
    children?: ReactNode;
}

Card.Eyebrow = function CardEyebrow({ decorate = false, className, children }: EyeBrowProps) {
    return (
        <p
            className={classNames(
                className,
                'relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500',
                decorate && 'pl-3.5',
            )}
        >
            {decorate && (
                <span className="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                    <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                </span>
            )}
            {children}
        </p>
    );
};
