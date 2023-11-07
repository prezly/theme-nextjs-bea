import { getCategoryHasTranslation, getLocalizedCategoryData } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { api, locale, routing } from '@/theme-kit';
import type { DisplayedCategory } from '@/ui';

import { Categories } from './Categories';
import { Languages } from './Languages';
import * as ui from './ui';

export async function Header() {
    const { contentDelivery } = api();
    const { generateUrl } = await routing();
    const localeCode = locale().code;
    const newsroom = await contentDelivery.newsroom();
    const categories = await contentDelivery.categories();
    const language = await contentDelivery.languageOrDefault(localeCode);

    const displayedCategories: DisplayedCategory[] = categories
        .filter((category) => category.public_stories_number > 0)
        .filter((category) => getCategoryHasTranslation(category, localeCode))
        .map((category) => {
            const { id } = category;
            const { name, description, slug } = getLocalizedCategoryData(category, localeCode);

            if (!slug) return undefined;

            const href = generateUrl('category', { slug, localeCode });

            return { id, href, name, description };
        })
        .filter(isNotUndefined);

    return (
        <ui.Header
            localeCode={localeCode}
            newsroom={newsroom}
            information={language.company_information}
            categories={displayedCategories}
        >
            <Categories />
            <Languages />
        </ui.Header>
    );
}
