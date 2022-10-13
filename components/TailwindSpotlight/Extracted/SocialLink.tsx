import classNames from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface IconTypeProps {
    className: string;
}

type IconType = (props: IconTypeProps) => JSX.Element;

interface SocialLinkProps {
    icon: IconType;
    href: string;
    className?: string;
    ariaLabel?: string;
    children?: ReactNode;
}

export default function SocialLink({
    icon: Icon,
    href,
    children,
    ariaLabel,
    className,
}: SocialLinkProps) {
    return (
        <li className={classNames('flex', className)}>
            <Link
                className="group flex text-sm font-medium text-zinc-800 transition hover:text-rose-500 dark:text-zinc-200 dark:hover:text-rose-500"
                href={href}
                aria-label={ariaLabel}
            >
                <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-rose-500" />
                {children && <span className="ml-4">{children}</span>}
            </Link>
        </li>
    );
}
