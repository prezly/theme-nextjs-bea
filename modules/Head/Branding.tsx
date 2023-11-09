import { getNewsroomFaviconUrl } from '@prezly/theme-kit-core';
import dynamic from 'next/dynamic';

import { themeSettings } from '@/theme/settings/server';
import { api } from '@/theme-kit';

import { BrandingSettings } from './branding';

const DynamicPreviewBranding = dynamic(
    async () => {
        const component = await import('./branding/DynamicPreviewBranding');
        return { default: component.DynamicPreviewBranding };
    },
    { ssr: false },
);

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
