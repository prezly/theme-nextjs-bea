'use client';

import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { Fragment, type ReactNode, useEffect } from 'react';

import { FormattedMessage } from '@/adapters/client';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { IconCaret } from '@/icons';

import { FeaturedCategory } from './FeaturedCategory';

import styles from './CategoriesNavDesktop.module.scss';
import { buildCategoryTree, type CategoryNode, categoryPath, hasSubcategories } from '@/utils';

export function CategoriesNavDesktop({
    buttonClassName,
    categories,
    localeCode,
    marginTop,
    navigationItemClassName,
    translatedCategories,
}: CategoriesNavDesktop.Props) {
    function getCategory(translated: TranslatedCategory) {
        return categories.find((category) => category.id === translated.id)!;
    }

    const featuredCategories = translatedCategories.filter(
        (translatedCategory) => getCategory(translatedCategory)?.is_featured,
    );
    const regularCategories = translatedCategories.filter(
        (translatedCategory) => !getCategory(translatedCategory)?.is_featured,
    );

    // With subcategories, the menu shows two levels: every top-level category is a column,
    // headed by the category itself, with its subcategories below. A third level is not shown
    // here; it is on the page of its parent. Without subcategories the menu is the flat list
    // it always was.
    const tree = buildCategoryTree(categories, translatedCategories);
    const columns = hasSubcategories(tree)
        ? tree.filter(
              (node) => node.children.length > 0 || !getCategory(node.category)?.is_featured,
          )
        : [];

    return (
        <li className={navigationItemClassName}>
            <Popover>
                {({ open, close }) => (
                    <>
                        <PopoverButton
                            as={Button}
                            className={classNames(styles.button, buttonClassName, {
                                [styles.rotateCaret]: open,
                            })}
                            variation="navigation"
                            icon={IconCaret}
                            iconPlacement="right"
                        >
                            <FormattedMessage
                                locale={localeCode}
                                for={translations.categories.title}
                            />
                        </PopoverButton>
                        <Transition
                            as={Fragment}
                            enter={styles.transition}
                            enterFrom={styles.transitionOpenStart}
                            enterTo={styles.transitionOpenFinish}
                            leave={styles.transition}
                            leaveFrom={styles.transitionOpenFinish}
                            leaveTo={styles.transitionOpenStart}
                        >
                            <div>
                                <PopoverPanel className={styles.popover} style={{ marginTop }}>
                                    <div className={styles.container}>
                                        <div
                                            className={classNames(styles.grid, {
                                                [styles.withOneFeatured]:
                                                    featuredCategories.length === 1,
                                                [styles.withTwoFeatured]:
                                                    featuredCategories.length === 2,
                                                [styles.withThreeFeatured]:
                                                    featuredCategories.length === 3,
                                                [styles.withFourFeatured]:
                                                    featuredCategories.length === 4,
                                            })}
                                        >
                                            {featuredCategories.length > 0 && (
                                                <div className={styles.featured}>
                                                    {featuredCategories.map(
                                                        (translatedCategory) => (
                                                            <FeaturedCategory
                                                                key={translatedCategory.id}
                                                                className={styles.category}
                                                                category={getCategory(
                                                                    translatedCategory,
                                                                )}
                                                                translatedCategory={
                                                                    translatedCategory
                                                                }
                                                                onClick={close}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            {featuredCategories.length > 0 &&
                                                (columns.length > 0 ||
                                                    regularCategories.length > 0) && (
                                                    <div className={styles.separator} />
                                                )}
                                            {columns.length > 0 && (
                                                <div className={styles.columns}>
                                                    {columns.map((node) => (
                                                        <CategoryColumn
                                                            key={node.category.id}
                                                            node={node}
                                                            localeCode={localeCode}
                                                            onClick={close}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {columns.length === 0 &&
                                                regularCategories.length > 0 && (
                                                    <div className={styles.regular}>
                                                        {regularCategories.map(
                                                            (translatedCategory) => (
                                                                <CategoryNavLink
                                                                    key={translatedCategory.id}
                                                                    className={styles.link}
                                                                    category={translatedCategory}
                                                                    onClick={close}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </PopoverPanel>
                                <div className={styles.backdrop} style={{ marginTop }} />
                            </div>
                        </Transition>
                        {open && <BlockPageScroll />}
                    </>
                )}
            </Popover>
        </li>
    );
}

/**
 * Subcategories listed under a top-level category in the menu. The rest are on its page.
 */
const MAX_SUBCATEGORIES = 6;

function CategoryColumn({
    node,
    localeCode,
    onClick,
}: {
    node: CategoryNode;
    localeCode: Locale.Code;
    onClick: () => void;
}) {
    const shown = node.children.slice(0, MAX_SUBCATEGORIES);

    return (
        <div className={styles.column}>
            <CategoryNavLink
                className={classNames(styles.link, styles.heading)}
                category={node.category}
                onClick={onClick}
            />
            {shown.map(({ category }) => (
                <CategoryNavLink
                    key={category.id}
                    className={classNames(styles.link, styles.sublink)}
                    category={category}
                    onClick={onClick}
                />
            ))}
            {node.children.length > shown.length && (
                <CategoryNavLink
                    className={classNames(styles.link, styles.sublink, styles.more)}
                    category={node.category}
                    onClick={onClick}
                >
                    <FormattedMessage locale={localeCode} for={translations.search.viewMore} />
                </CategoryNavLink>
            )}
        </div>
    );
}

function CategoryNavLink({
    category,
    children,
    className,
    onClick,
}: {
    category: TranslatedCategory;
    children?: ReactNode;
    className?: string;
    onClick: () => void;
}) {
    return (
        <Link
            className={className}
            href={{
                routeName: 'category',
                params: { path: categoryPath(category), localeCode: category.locale },
            }}
            onClick={onClick}
        >
            {children ?? category.name}
        </Link>
    );
}

function BlockPageScroll() {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    useEffect(() => {
        document.body.classList.add(styles.preventScroll);
        document.body.style.marginRight = `${scrollBarWidth}px`;
        return () => {
            document.body.classList.remove(styles.preventScroll);
            document.body.style.marginRight = '0';
        };
    }, [scrollBarWidth]);

    return null;
}

export namespace CategoriesNavDesktop {
    export interface Props {
        buttonClassName?: string;
        categories: Category[];
        localeCode: Locale.Code;
        marginTop: number | undefined;
        navigationItemClassName?: string;
        translatedCategories: TranslatedCategory[];
    }
}
