import { Menu } from '@headlessui/react';
import type { Category } from '@prezly/sdk/dist/types';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import { IconMenu } from '@/icons';

import CategoryItem from './CategoryItem';

import styles from './CategoriesDropdown.module.scss';

type Props = {
    categories: Category[];
};

const CategoriesDropdown: FunctionComponent<Props> = ({ categories }) => (
    <Menu as="div" className={styles.container}>
        {({ open }) => (
            <>
                <Menu.Button as={React.Fragment}>
                    <Button variation="navigation" isActive={open} icon={IconMenu}>
                        Categories
                    </Button>
                </Menu.Button>
                <Menu.Items as="ul" className={styles.menu}>
                    {categories.map((category) => (
                        <CategoryItem category={category} key={category.id} />
                    ))}
                </Menu.Items>
            </>
        )}
    </Menu>
);

export default CategoriesDropdown;
