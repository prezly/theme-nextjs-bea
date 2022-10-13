import classNames from 'clsx';
import type { PropsWithChildren } from 'react';

export function Prose({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <div className={classNames(className, 'prose dark:prose-invert')}>{children}</div>;
}
