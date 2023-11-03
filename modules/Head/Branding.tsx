import { getNewsroomFaviconUrl } from '@prezly/theme-kit-core';

import { DynamicPreviewBranding } from '@/modules/Head/branding/DynamicPreviewBranding';
import { api } from '@/theme-kit';

import { BrandingSettings } from './branding';

export async function Branding() {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();
    const theme = await contentDelivery.theme();

    const settings = theme?.settings ?? {};

    const faviconUrl = getNewsroomFaviconUrl(newsroom, 180);
    return (
        <>
            <BrandingSettings faviconUrl={faviconUrl} settings={settings} />
            <DynamicPreviewBranding faviconUrl={faviconUrl} settings={settings} />
        </>
    );
}
