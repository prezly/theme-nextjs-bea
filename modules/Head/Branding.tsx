import { app } from '@/adapters/server';

import { BrandingSettings } from './components';

export async function Branding() {
    const settings = await app().themeSettings();

    return (
        <>
            <BrandingSettings settings={settings} />
        </>
    );
}
