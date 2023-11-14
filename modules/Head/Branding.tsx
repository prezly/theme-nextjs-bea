import { getNewsroomFaviconUrl } from '@prezly/theme-kit-core';
import dynamic from 'next/dynamic';

import { app } from '@/theme/server';

import { BrandingSettings } from './branding';

const DynamicPreviewBranding = dynamic(
    async () => {
        const component = await import('./branding/DynamicPreviewBranding');
        return { default: component.DynamicPreviewBranding };
    },
    { ssr: false },
);

export async function Branding() {
    const newsroom = await app().newsroom();
    const settings = await app().themeSettings();

    const faviconUrl = getNewsroomFaviconUrl(newsroom, 180);

    return (
        <>
            <BrandingSettings faviconUrl={faviconUrl} settings={settings} />
            <DynamicPreviewBranding settings={settings} />
        </>
    );
}
