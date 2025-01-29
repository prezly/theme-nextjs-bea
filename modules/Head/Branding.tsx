import dynamic from 'next/dynamic';

import { app } from '@/adapters/server';

import { BrandingSettings } from './components';

const DynamicPreviewBranding = dynamic(
    async () => {
        const component = await import('./components/DynamicPreviewBranding');
        return { default: component.DynamicPreviewBranding };
    },
    { ssr: true },
);

export async function Branding() {
    const settings = await app().themeSettings();

    return (
        <>
            <BrandingSettings settings={settings} />
            <DynamicPreviewBranding settings={settings} />
        </>
    );
}
