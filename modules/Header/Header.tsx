import { app, environment } from '@/adapters/server';

import { Categories } from './Categories';
import { Languages } from './Languages';
import * as ui from './ui';

interface Props {
    isSearchPage?: boolean;
}

export async function Header(props: Props) {
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = environment();
    const localeCode = app().locale();
    const newsroom = await app().newsroom();
    const language = await app().languageOrDefault(localeCode);

    const categories = await app().translatedCategories();

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
            isSearchPage={props.isSearchPage}
        >
            <Categories />
            <Languages />
        </ui.Header>
    );
}
