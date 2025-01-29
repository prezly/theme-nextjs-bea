import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';
import type { ThemeSettings } from '@/theme-settings';

import * as ui from './ui';

interface Props {
    accentColor: ThemeSettings['accent_color'];
    localeCode: Locale.Code;
}

export async function FeaturedCategories({ accentColor, localeCode }: Props) {
    const categories = await app().categories();
    const translatedCategories = await app().translatedCategories(
        localeCode,
        categories.filter((i) => i.is_featured && i.i18n[localeCode]?.public_stories_number > 0),
    );

    if (translatedCategories.length === 0) {
        return null;
    }

    return (
        <ui.FeaturedCategories
            accentColor={accentColor}
            categories={categories}
            localeCode={localeCode}
            translatedCategories={translatedCategories}
        />
    );
}
