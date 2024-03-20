import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/client';
import { Dropdown } from '@/components/Dropdown';

import { CategoryItem } from './CategoryItem';

export function CategoriesNavDesktop({
    categories,
    localeCode,
    buttonClassName,
    navigationItemClassName,
}: CategoriesNavDesktop.Props) {
    return (
        <li className={navigationItemClassName}>
            <Dropdown
                label={<FormattedMessage locale={localeCode} for={translations.categories.title} />}
                buttonClassName={buttonClassName}
                withMobileDisplay
            >
                {categories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                ))}
            </Dropdown>
        </li>
    );
}

export namespace CategoriesNavDesktop {
    export interface Props {
        categories: TranslatedCategory[];
        localeCode: Locale.Code;
        buttonClassName?: string;
        navigationItemClassName?: string;
    }
}
