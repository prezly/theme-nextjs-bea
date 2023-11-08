import { api, displayedCategories, env, locale } from '@/theme-kit';

import { Categories } from './Categories';
import { Languages } from './Languages';
import * as ui from './ui';

export async function Header() {
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = env();
    const { contentDelivery } = api();
    const localeCode = locale().code;
    const newsroom = await contentDelivery.newsroom();
    const language = await contentDelivery.languageOrDefault(localeCode);

    const categories = await displayedCategories();

    const algoliaSettings =
        ALGOLIA_APP_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX
            ? {
                  appId: ALGOLIA_APP_ID,
                  apiKey: ALGOLIA_API_KEY,
                  index: ALGOLIA_INDEX,
              }
            : undefined;

    return (
        <ui.Header
            algoliaSettings={algoliaSettings}
            localeCode={localeCode}
            newsroom={newsroom}
            information={language.company_information}
            categories={categories}
        >
            <Categories />
            <Languages />
        </ui.Header>
    );
}
