import classNames from 'clsx';
import type { ReactNode } from 'react';

interface Props {
    title: string;
    subtitle?: ReactNode;
    className?: string;
}

function PageTitle({ title, subtitle, className }: Props) {
    return (
        <header className={classNames('max-w-2xl mb-12', className)}>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                {title}
            </h1>
            {subtitle && (
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">{subtitle}</p>
            )}
        </header>
    );
}

export default PageTitle;
