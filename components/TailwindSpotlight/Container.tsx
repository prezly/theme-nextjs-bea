import classNames from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: ReactNode;
}

export const OuterContainer = forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={classNames('sm:px-8', className)} {...props}>
            <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
        </div>
    ),
);

export const InnerContainer = forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, children, ...props }: ContainerProps, ref) => (
        <div
            ref={ref}
            className={classNames('relative px-4 sm:px-8 lg:px-12', className)}
            {...props}
        >
            <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
        </div>
    ),
);

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, ...props }, ref) => (
        <OuterContainer ref={ref} {...props}>
            <InnerContainer>{children}</InnerContainer>
        </OuterContainer>
    ),
);
