import classNames from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';

const primaryVariantClassnames =
    'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70';
const secondaryVariantClassnames =
    'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70';

interface ButtonProps {
    variant?: string;
    className?: string;
    href?: string;
    children?: ReactNode;
    buttonType?: 'button' | 'submit' | 'reset';
}

export function Button({
    variant = 'primary',
    className,
    href,
    children,
    buttonType,
}: ButtonProps) {
    const classNameWithVariant = classNames(
        'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
        className,
        {
            [primaryVariantClassnames]: variant === 'primary',
            [secondaryVariantClassnames]: variant === 'secondary',
        },
    );

    return href ? (
        <Link href={href} className={classNameWithVariant}>
            {children}
        </Link>
    ) : (
        <button className={classNameWithVariant} type={buttonType}>
            {children}
        </button>
    );
}
