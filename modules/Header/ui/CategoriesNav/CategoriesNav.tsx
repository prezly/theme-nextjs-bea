import type { TranslatedCategory } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { Dropdown } from '@/components/Dropdown';

import { CategoryButton } from './CategoryButton';
import { CategoryItem } from './CategoryItem';

import styles from './CategoriesNav.module.scss';

export function CategoriesNav({
    categories,
    buttonClassName,
    navigationItemClassName,
    navigationButtonClassName,
}: CategoriesNav.Props) {
    const locale = useLocale();
    const showAllCategoriesOnMobile = categories.length < 4;

    return (
        <>
            {showAllCategoriesOnMobile && (
                <>
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className={classNames(navigationItemClassName, styles.mobileCategory)}
                        >
                            <CategoryButton
                                className={navigationButtonClassName}
                                category={category}
                            />
                        </li>
                    ))}
                </>
            )}
            <li
                className={classNames(navigationItemClassName, {
                    [styles.desktopCategories]: showAllCategoriesOnMobile,
                })}
            >
                <Dropdown
                    label={<FormattedMessage locale={locale} for={translations.categories.title} />}
                    buttonClassName={buttonClassName}
                    withMobileDisplay
                >
                    {categories.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
                </Dropdown>
            </li>
        </>
    );
}

export namespace CategoriesNav {
    export interface Props {
        categories: TranslatedCategory[];
        buttonClassName?: string;
        navigationItemClassName?: string;
        navigationButtonClassName?: string;
    }
}
