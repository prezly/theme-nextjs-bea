'use client';

import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react';

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

    // With subcategories, every top-level category is a column, headed by the category itself,
    // with its subcategories below and a third level indented under those. Without
    // subcategories the menu is the flat list it always was.
    //
    // A featured category has its tile above the columns, at any level, so it is left out of
    // them: it would be in the menu twice.
    const tree = buildCategoryTree(categories, translatedCategories);
    const columns = hasSubcategories(tree)
        ? tree
              .map((node) => ({
                  ...node,
                  children: node.children.filter(
                      (child) => !getCategory(child.category)?.is_featured,
                  ),
              }))
              .filter(
                  (node) => node.children.length > 0 || !getCategory(node.category)?.is_featured,
              )
        : [];

    // The panel is placed under the header, by the header's height. That height is measured by
    // the header and handed down, but the measurement can be missing (it has been seen to not
    // arrive), and the panel then covers the logo and the menu button. So it is measured again
    // here, the moment the menu is opened, and used when nothing was handed down.
    const itemRef = useRef<HTMLLIElement>(null);
    const [measuredTop, setMeasuredTop] = useState<number>();
    const panelTop = marginTop ?? measuredTop;

    function measureHeader() {
        const header = itemRef.current?.closest('header');
        if (header) {
            setMeasuredTop(header.getBoundingClientRect().bottom + window.scrollY);
        }
    }

    return (
        <li className={navigationItemClassName} ref={itemRef}>
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
                            onClick={measureHeader}
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
                                <PopoverPanel
                                    className={styles.popover}
                                    style={{ marginTop: panelTop }}
                                >
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
                                <div className={styles.backdrop} style={{ marginTop: panelTop }} />
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
 * Subcategories listed under a category in the menu, at each level. The rest are on its page.
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
            {shown.map(({ category, children }) => (
                <Fragment key={category.id}>
                    <CategoryNavLink
                        className={classNames(styles.link, styles.sublink)}
                        category={category}
                        onClick={onClick}
                    />
                    {/* The third level: indented under its parent, along a thin line. */}
                    {children.length > 0 && (
                        <div className={styles.thirdLevelGroup}>
                            {children
                                .slice(0, MAX_SUBCATEGORIES)
                                .map(({ category: grandchild }) => (
                                    <CategoryNavLink
                                        key={grandchild.id}
                                        className={classNames(styles.link, styles.thirdLevel)}
                                        category={grandchild}
                                        onClick={onClick}
                                    />
                                ))}
                            {children.length > MAX_SUBCATEGORIES && (
                                <CategoryNavLink
                                    className={classNames(
                                        styles.link,
                                        styles.thirdLevel,
                                        styles.more,
                                    )}
                                    category={category}
                                    onClick={onClick}
                                >
                                    <FormattedMessage
                                        locale={localeCode}
                                        for={translations.search.viewMore}
                                    />
                                </CategoryNavLink>
                            )}
                        </div>
                    )}
                </Fragment>
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
