import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { CategoriesNavDesktop } from './CategoriesNavDesktop';
import { CategoriesNavMobile } from './CategoriesNavMobile';

import styles from './CategoriesNav.module.scss';

export function CategoriesNav({
    categories,
    localeCode,
    buttonClassName,
    navigationItemClassName,
    navigationButtonClassName,
}: CategoriesNav.Props) {
    return (
        <>
            <CategoriesNavMobile
                categories={categories}
                localeCode={localeCode}
                buttonClassName={buttonClassName}
                navigationItemClassName={classNames(
                    navigationItemClassName,
                    styles.mobileCategories,
                )}
                navigationItemButtonClassName={navigationButtonClassName}
            />
            <CategoriesNavDesktop
                categories={categories}
                localeCode={localeCode}
                buttonClassName={buttonClassName}
                navigationItemClassName={classNames(
                    navigationItemClassName,
                    styles.desktopCategories,
                )}
            />
        </>
    );
}

export namespace CategoriesNav {
    export interface Props {
        categories: TranslatedCategory[];
        localeCode: Locale.Code;
        buttonClassName?: string;
        navigationItemClassName?: string;
        navigationButtonClassName?: string;
    }
}
