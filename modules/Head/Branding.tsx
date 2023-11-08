import { getNewsroomFaviconUrl } from '@prezly/theme-kit-core';

import { themeSettings } from '@/theme/settings';
import { api } from '@/theme-kit';

import { BrandingSettings } from './branding';
import { DynamicPreviewBranding } from './branding/DynamicPreviewBranding';

export async function Branding() {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();
    const settings = await themeSettings();

    const faviconUrl = getNewsroomFaviconUrl(newsroom, 180);

    return (
        <>
            <BrandingSettings faviconUrl={faviconUrl} settings={settings} />
            <DynamicPreviewBranding settings={settings} />
        </>
    );
}
