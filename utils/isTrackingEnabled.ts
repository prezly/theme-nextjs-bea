import { getEnvVariables } from '@prezly/theme-kit-nextjs';
import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

export function isTrackingEnabled(
    context: GetServerSidePropsContext | GetStaticPropsContext,
): boolean {
    return getEnvVariables('req' in context ? context.req : undefined).PREZLY_MODE !== 'preview';
}
