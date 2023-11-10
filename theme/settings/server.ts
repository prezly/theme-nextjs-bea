import { withoutUndefined } from '@/utils';

import { DEFAULT_THEME_SETTINGS } from './shared';

export * from './shared';

export async function themeSettings() {
    const { api } = await import('@/theme/server');
    const { contentDelivery } = api();

    const theme = await contentDelivery.theme();

    return {
        ...DEFAULT_THEME_SETTINGS,
        ...withoutUndefined(theme?.settings ?? {}),
    };
}
