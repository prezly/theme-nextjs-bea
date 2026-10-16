'use client';

import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react';

import { type AppUrlGeneratorParams, useBasePathConfig, useRouting } from '@/adapters/client';
import { isReverseProxyConfigured } from '@/utils';

export function Link({
    forceRefresh = false,
    href,
    children,
    forwardRef,
    ...attributes
}: Link.Props) {
    const { generateUrl } = useRouting();
    const basePathConfig = useBasePathConfig();

    const isRouteObject = typeof href === 'object' && 'routeName' in href;
    const renderedHref = isRouteObject
        ? generateUrl(href.routeName, href.params ?? {}) + (href.hash ?? '')
        : href;

    // Behind a reverse proxy, the bare index URL (e.g. /<locale>/news) can hit a
    // trailing-slash redirect (/news -> /news/) that breaks RSC soft-navigation —
    // the URL changes but the page doesn't refresh. Force a full navigation for
    // index links so the browser follows the redirect. No-op for normal
    // (non-reverse-proxy) deployments.
    const reverseProxyActive = isReverseProxyConfigured(basePathConfig);
    const isIndexLink = isRouteObject && href.routeName === 'index';
    const shouldForceRefresh = forceRefresh || (reverseProxyActive && isIndexLink);

    if (shouldForceRefresh) {
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
        href: string | (AppUrlGeneratorParams & { hash?: string });
        children?: ReactNode;
        forceRefresh?: boolean;
        forwardRef?: Ref<HTMLAnchorElement>;
    }
}
