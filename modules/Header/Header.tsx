import type { Locale } from '@prezly/theme-kit-nextjs';

import { app, environment } from '@/adapters/server';

import { Categories } from './Categories';
import { Languages } from './Languages';
import * as ui from './ui';

interface Props {
    localeCode: Locale.Code;
}

export async function Header({ localeCode }: Props) {
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = environment();
    const newsroom = await app().newsroom();
    const displayedLanguages = await app().usedLanguages();
    const language = await app().languageOrDefault(localeCode);

    const categories = await app().translatedCategories(localeCode);

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
            displayedLanguages={displayedLanguages.length}
            displayedGalleries={newsroom.public_galleries_number}
        >
            <Categories localeCode={localeCode} />
            <Languages localeCode={localeCode} />
        </ui.Header>
    );
}
