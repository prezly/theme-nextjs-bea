'use client';

import { RoutingAdapter } from '@prezly/theme-kit-nextjs/client';

import type { AppRoutes } from '../server/routing';

export type * from '../server/routing';

export const { useRouting, RoutingContextProvider } = RoutingAdapter.connect<AppRoutes>();
