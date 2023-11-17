import { app } from '@/adapters/server';

import * as ui from './ui';

export async function Boilerplate() {
    const newsroom = await app().newsroom();
    const language = await app().languageOrDefault();

    return <ui.Boilerplate newsroom={newsroom} companyInformation={language.company_information} />;
}
