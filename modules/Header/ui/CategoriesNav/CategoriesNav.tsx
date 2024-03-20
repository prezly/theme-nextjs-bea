import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { app } from '@/adapters/server';

import { CategoriesNavDesktop } from './CategoriesNavDesktop';
import { CategoriesNavMobile } from './CategoriesNavMobile';

import styles from './CategoriesNav.module.scss';

export async function CategoriesNav({
    translatedCategories,
    localeCode,
    buttonClassName,
    navigationItemClassName,
    navigationButtonClassName,
}: CategoriesNav.Props) {
    const categories = await app().categories();

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
            />
        </>
    );
}

export namespace CategoriesNav {
    export interface Props {
        translatedCategories: TranslatedCategory[];
        localeCode: Locale.Code;
        buttonClassName?: string;
        navigationItemClassName?: string;
        navigationButtonClassName?: string;
    }
}
