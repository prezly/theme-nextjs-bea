import { Menu } from '@headlessui/react';
import { Category } from '@prezly/sdk';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { getCategoryUrl } from '@/utils/prezly';

import CategoryLink from './CategoryLink';

import styles from './CategoryItem.module.scss';

type Props = {
    category: Category;
};

const CategoryItem: FunctionComponent<Props> = ({ category }) => (
    <Menu.Item as="li" className={styles.category} key={category.id}>
        {({ active }) => (
            <CategoryLink
                href={getCategoryUrl(category)}
                className={classNames(styles.link, {
                    [styles.active]: active,
                })}
            >
                <span className={styles.title}>{category.display_name}</span>
                {category.display_description && (
                    <span className={styles.description}>{category.display_description}</span>
                )}
            </CategoryLink>
        )}
    </Menu.Item>
);

export default CategoryItem;
