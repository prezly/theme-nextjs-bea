import { api, locale } from '@/theme-kit';

import { Categories } from './Categories';
import { Languages } from './Languages';
import * as ui from './ui';

export async function Header() {
    const { contentDelivery } = api();
    const localeCode = locale().code;
    const newsroom = await contentDelivery.newsroom();
    const language = await contentDelivery.languageOrDefault(localeCode);

    return (
        <ui.Header
            localeCode={localeCode}
            newsroom={newsroom}
            information={language.company_information}
        >
            <Categories />
            <Languages />
        </ui.Header>
    );
}
