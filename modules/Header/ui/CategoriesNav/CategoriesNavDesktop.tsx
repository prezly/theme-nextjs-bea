'use client';

import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { Fragment, useEffect } from 'react';

import { FormattedMessage } from '@/adapters/client';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { IconCaret } from '@/icons';

import { FeaturedCategory } from './FeaturedCategory';

import styles from './CategoriesNavDesktop.module.scss';

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
                                                regularCategories.length > 0 && (
                                                    <div className={styles.separator} />
                                                )}
                                            {regularCategories.length > 0 && (
                                                <div className={styles.regular}>
                                                    {regularCategories.map((translatedCategory) => (
                                                        <Link
                                                            key={translatedCategory.id}
                                                            className={styles.link}
                                                            href={{
                                                                routeName: 'category',
                                                                params: {
                                                                    slug: translatedCategory.slug,
                                                                    localeCode:
                                                                        translatedCategory.locale,
                                                                },
                                                            }}
                                                            onClick={close}
                                                        >
                                                            {translatedCategory.name}
                                                        </Link>
                                                    ))}
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

function BlockPageScroll() {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    useEffect(() => {
        document.body.classList.add(styles.preventScroll);
        document.body.style.marginRight = `${scrollBarWidth}px`;
        return () => {
            document.body.classList.remove(styles.preventScroll);
            document.body.style.marginRight = `0`;
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
