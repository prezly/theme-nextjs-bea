import type { Locale } from '@prezly/theme-kit-nextjs';

import { app, getSearchSettings } from '@/adapters/server';

import { Languages } from './Languages';
import * as ui from './ui';

interface Props {
    localeCode: Locale.Code;
}

export async function Header({ localeCode }: Props) {
    const newsroom = await app().newsroom();
    const displayedLanguages = await app().usedLanguages();
    const language = await app().languageOrDefault(localeCode);
    const settings = await app().themeSettings();
    const searchSettings = getSearchSettings();

    const categories = await app().categories();
    const displayedCategories = await app().translatedCategories(
        localeCode,
        categories.filter((category) => category.i18n[localeCode]?.public_stories_number > 0),
    );

    return (
        <ui.Header
            searchSettings={searchSettings}
            localeCode={localeCode}
            newsroom={newsroom}
            information={language.company_information}
            categories={categories}
            translatedCategories={displayedCategories}
            displayedLanguages={displayedLanguages.length}
            displayedGalleries={newsroom.public_galleries_number}
            categoriesLayout={settings.categories_layout}
            logoSize={settings.logo_size}
            mainSiteUrl={settings.main_site_url}
        >
            <Languages localeCode={localeCode} />
        </ui.Header>
    );
}
