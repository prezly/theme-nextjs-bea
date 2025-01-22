'use client';

import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react';

import { type AppUrlGeneratorParams, useRouting } from '@/adapters/client';

export function Link({
    forceRefresh = false,
    href,
    children,
    forwardRef,
    ...attributes
}: Link.Props) {
    const { generateUrl } = useRouting();

    const renderedHref =
        typeof href === 'object' && 'routeName' in href
            ? generateUrl(href.routeName, href.params ?? {})
            : href;

    if (forceRefresh) {
        return (
            <a ref={forwardRef} href={renderedHref} {...attributes}>
                {children}
            </a>
        );
    }

    return (
        <NextLink ref={forwardRef} href={renderedHref} {...attributes}>
            {children}
        </NextLink>
    );
}

export namespace Link {
    export interface Props
        extends Omit<NextLinkProps, 'href'>,
            Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
        href: string | AppUrlGeneratorParams;
        children?: ReactNode;
        forceRefresh?: boolean;
        forwardRef?: Ref<HTMLAnchorElement>;
    }
}
