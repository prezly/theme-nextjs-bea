import { getEnvVariables } from '@prezly/theme-kit-nextjs';
import type { GetServerSidePropsContext } from 'next';

export function isTrackingEnabled(context: GetServerSidePropsContext): boolean {
    return getEnvVariables(context.req).PREZLY_MODE !== 'preview';
}
