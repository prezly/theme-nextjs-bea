import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { CategoriesNavDesktop } from './CategoriesNavDesktop';
import { CategoriesNavMobile } from './CategoriesNavMobile';

import styles from './CategoriesNav.module.scss';

export function CategoriesNav({
    buttonClassName,
    categories,
    localeCode,
    marginTop,
    navigationButtonClassName,
    navigationItemClassName,
    translatedCategories,
}: CategoriesNav.Props) {
    return (
        <>
            <CategoriesNavMobile
                categories={categories}
                translatedCategories={translatedCategories}
                localeCode={localeCode}
                navigationItemClassName={classNames(
                    navigationItemClassName,
                    styles.mobileCategories,
                )}
                navigationItemButtonClassName={navigationButtonClassName}
            />
            <CategoriesNavDesktop
                categories={categories}
                translatedCategories={translatedCategories}
                localeCode={localeCode}
                buttonClassName={buttonClassName}
                navigationItemClassName={classNames(
                    navigationItemClassName,
                    styles.desktopCategories,
                )}
                marginTop={marginTop}
            />
        </>
    );
}

export namespace CategoriesNav {
    export interface Props {
        buttonClassName?: string;
        categories: Category[];
        localeCode: Locale.Code;
        marginTop: number | undefined;
        navigationButtonClassName?: string;
        navigationItemClassName?: string;
        translatedCategories: TranslatedCategory[];
    }
}
