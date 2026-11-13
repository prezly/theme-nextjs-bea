import type { Category, TranslatedCategory } from '@prezly/sdk';
import { FormattedMessage, translations } from '@prezly/theme-kit-nextjs';
import { useMeasure } from '@react-hookz/web';
import classNames from 'classnames';
import { useParams } from 'next/navigation';
import { Fragment, useMemo } from 'react';

import { useLocale } from '@/adapters/client';

import { Dropdown } from '../Dropdown';
import { Link } from '../Link';

import { CategoryItem } from './CategoryItem';

import styles from './CategoriesBar.module.scss';
import {
    buildCategoryTree,
    type CategoryNode,
    categoryPath,
    categoryPathFromSegments,
    isCategoryPathActive,
} from '@/utils';

const MORE_BUTTON_WIDTH = +styles.MORE_BUTTON_WIDTH.replace('px', '');

type Props = {
    /**
     * Every category of the site: they say which category is under which.
     */
    categories: Pick<Category, 'id' | 'parent_id'>[];
    translatedCategories: TranslatedCategory[];
};

export function CategoriesBar({ categories, translatedCategories }: Props) {
    const locale = useLocale();
    // The category page is a catch-all route: `/category/cars/models` gives `['cars', 'models']`.
    const { path } = useParams<{ path?: string[] }>();
    const currentPath = path ? categoryPathFromSegments(path) : undefined;
    const [measurements, containerRef] = useMeasure<HTMLDivElement>();
    const containerWidth = measurements?.width ?? 0;

    // The bar shows the top-level categories. One with subcategories opens a menu with them.
    const tree = useMemo(
        () => buildCategoryTree(categories, translatedCategories),
        [categories, translatedCategories],
    );

    const [visibleCategories, hiddenCategories] = useMemo<[CategoryNode[], CategoryNode[]]>(() => {
        if (!containerRef.current) {
            return [tree, []];
        }

        const { paddingLeft, paddingRight } = getComputedStyle(containerRef.current);
        const containerWidthWithoutPadding =
            containerWidth - Number.parseInt(paddingLeft, 10) - Number.parseInt(paddingRight, 10);

        if (containerRef.current.scrollWidth <= containerWidthWithoutPadding) {
            return [tree, []];
        }

        let index = 0;
        let width = 0;
        const widthLimit = containerWidthWithoutPadding - MORE_BUTTON_WIDTH;
        const nodesArray = Array.from(containerRef.current.children);

        for (let i = 0; i < nodesArray.length; i += 1) {
            const { width: nodeWidth } = nodesArray[i].getBoundingClientRect();

            if (nodeWidth + width > widthLimit) {
                break;
            }
            width += nodeWidth;
            index = i + 1;
        }

        return [tree.slice(0, index), tree.slice(index)];
    }, [tree, containerRef, containerWidth]);

    if (!visibleCategories.length) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container} ref={containerRef}>
                {visibleCategories.map(({ category, children }) => {
                    const isActive = isCategoryPathActive(categoryPath(category), currentPath);

                    if (children.length > 0) {
                        return (
                            <Dropdown
                                key={category.id}
                                label={category.name}
                                className={styles.group}
                                buttonClassName={classNames(styles.link, styles.parent, {
                                    [styles.active]: isActive,
                                })}
                            >
                                <CategoryItem category={category} localeCode={locale} />
                                {children.map((child) => (
                                    <CategoryItem
                                        key={child.category.id}
                                        category={child.category}
                                        localeCode={locale}
                                        isSubcategory
                                    />
                                ))}
                            </Dropdown>
                        );
                    }

                    return (
                        <Link
                            key={category.id}
                            href={{
                                routeName: 'category',
                                params: { localeCode: locale, path: categoryPath(category) },
                            }}
                            className={classNames(styles.link, { [styles.active]: isActive })}
                            title={category.description || undefined}
                        >
                            {category.name}
                        </Link>
                    );
                })}
                {hiddenCategories.length > 0 && (
                    <Dropdown
                        label={<FormattedMessage locale={locale} for={translations.actions.more} />}
                        buttonClassName={styles.more}
                    >
                        {hiddenCategories.map(({ category, children }) => (
                            <Fragment key={category.id}>
                                <CategoryItem category={category} localeCode={locale} />
                                {/* Subcategories stay reachable when their parent does not fit in the bar. */}
                                {children.map((child) => (
                                    <CategoryItem
                                        key={child.category.id}
                                        category={child.category}
                                        localeCode={locale}
                                        isSubcategory
                                    />
                                ))}
                            </Fragment>
                        ))}
                    </Dropdown>
                )}
            </div>
        </div>
    );
}
