'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import type { TranslatedCategory } from '@prezly/sdk';
import { FormattedMessage, translations } from '@prezly/theme-kit-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { IconArrowRight, IconCaret } from '@/icons';
import { type CategoryNode, categoryPath } from '@/utils';

import { Link } from '../Link';

import styles from './CategoryMenu.module.scss';

/**
 * Categories listed under a subcategory in the panel. The rest are on its page.
 */
const MAX_LISTED = 6;

/**
 * A top-level category with subcategories, in the bar: a button that opens a panel as wide as
 * the page, with everything below the category. The second level heads the columns, the third
 * level is listed under it.
 *
 * The button only opens the panel, with a click: one control does one thing, the same with a
 * mouse, a keyboard and a touch screen. The category's own page is the first link in the panel.
 */
export function CategoryMenu({ node, localeCode, buttonClassName }: CategoryMenu.Props) {
    const { category, children } = node;

    return (
        <Popover className={styles.menu}>
            {({ open, close }) => (
                <>
                    <PopoverButton className={classNames(styles.button, buttonClassName)}>
                        {category.name}
                        <IconCaret
                            aria-hidden
                            width={12}
                            height={12}
                            className={classNames(styles.caret, { [styles.caretOpen]: open })}
                        />
                    </PopoverButton>
                    <PopoverPanel className={styles.panel}>
                        <div className={styles.content}>
                            <CategoryLink
                                category={category}
                                className={styles.all}
                                onClick={close}
                            >
                                <span className={styles.allName}>{category.name}</span>
                                <span className={styles.allLabel}>
                                    <FormattedMessage
                                        locale={localeCode}
                                        for={translations.homepage.allStories}
                                    />
                                    <IconArrowRight aria-hidden width={14} height={14} />
                                </span>
                            </CategoryLink>
                            <ul className={styles.columns}>
                                {children.map((child) => (
                                    <li key={child.category.id} className={styles.column}>
                                        <CategoryLink
                                            category={child.category}
                                            className={styles.heading}
                                            onClick={close}
                                        />
                                        {child.children.length > 0 && (
                                            <ul className={styles.list}>
                                                {child.children
                                                    .slice(0, MAX_LISTED)
                                                    .map(({ category: grandchild }) => (
                                                        <li key={grandchild.id}>
                                                            <CategoryLink
                                                                category={grandchild}
                                                                className={styles.link}
                                                                onClick={close}
                                                            />
                                                        </li>
                                                    ))}
                                                {child.children.length > MAX_LISTED && (
                                                    <li>
                                                        <CategoryLink
                                                            category={child.category}
                                                            className={classNames(
                                                                styles.link,
                                                                styles.more,
                                                            )}
                                                            onClick={close}
                                                        >
                                                            <FormattedMessage
                                                                locale={localeCode}
                                                                for={translations.search.viewMore}
                                                            />
                                                        </CategoryLink>
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    );
}

function CategoryLink({
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

export namespace CategoryMenu {
    export interface Props {
        node: CategoryNode;
        localeCode: Locale.Code;
        buttonClassName?: string;
    }
}
