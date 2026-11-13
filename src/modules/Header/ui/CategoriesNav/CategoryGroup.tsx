'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs/index';
import classNames from 'classnames';

import { FormattedMessage } from '@/adapters/client';
import { IconCaret } from '@/icons';
import type { CategoryNode } from '@/utils';

import { CategoryItem } from './CategoryItem';

import styles from './CategoryGroup.module.scss';

/**
 * A category with subcategories, in the mobile menu: a row that opens the list of what is
 * below it. Tapping "Models" shows the models, because that is what a visitor browsing the
 * menu is after. The page of the category itself is one quieter link at the top of the list.
 *
 * It nests: a subcategory with subcategories of its own is a group inside the list.
 */
export function CategoryGroup({ node, localeCode }: CategoryGroup.Props) {
    const { category, children } = node;

    return (
        <Disclosure as="li" className={styles.group}>
            {({ open }) => (
                <>
                    <DisclosureButton className={styles.button}>
                        <span className={styles.name}>{category.name}</span>
                        <IconCaret
                            aria-hidden
                            width={12}
                            height={12}
                            className={classNames(styles.caret, { [styles.caretOpen]: open })}
                        />
                    </DisclosureButton>
                    <DisclosurePanel as="ul" className={styles.list}>
                        <CategoryItem category={category} isSubtle>
                            <FormattedMessage
                                locale={localeCode}
                                for={translations.homepage.allStories}
                            />
                        </CategoryItem>
                        {children.map((child) =>
                            child.children.length > 0 ? (
                                <CategoryGroup
                                    key={child.category.id}
                                    node={child}
                                    localeCode={localeCode}
                                />
                            ) : (
                                <CategoryItem
                                    key={child.category.id}
                                    category={child.category}
                                    isSubcategory
                                />
                            ),
                        )}
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}

export namespace CategoryGroup {
    export interface Props {
        node: CategoryNode;
        localeCode: Locale.Code;
    }
}
