import { api } from '@/theme/server';
import { locale } from '@/theme-kit';

import * as ui from './ui';

export async function Boilerplate() {
    const localeCode = locale().code;
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();
    const language = await contentDelivery.languageOrDefault(localeCode);

    return <ui.Boilerplate newsroom={newsroom} companyInformation={language.company_information} />;
}
