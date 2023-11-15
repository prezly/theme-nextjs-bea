import { Newsrooms } from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';

import { app } from '@/adapters/server';

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

    const faviconUrl = Newsrooms.getFaviconUrl(newsroom, 180);

    return (
        <>
            <BrandingSettings faviconUrl={faviconUrl} settings={settings} />
            <DynamicPreviewBranding settings={settings} />
        </>
    );
}
