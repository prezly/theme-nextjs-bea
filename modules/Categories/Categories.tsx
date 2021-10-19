import { Menu } from '@headlessui/react';
import type { Category } from '@prezly/sdk/dist/types';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import { IconMenu } from '@/icons';

import CategoryComponent from '../Category';

import styles from './Categories.module.scss';

type Props = {
    categories: Category[];
};

const Categories: FunctionComponent<Props> = ({ categories }) => (
    <Menu as="div" className={styles.container}>
        {({ open }) => (
            <>
                <Menu.Button as={React.Fragment}>
                    <Button variation="navigation" isActive={open} icon={<IconMenu />}>
                        Categories
                    </Button>
                </Menu.Button>
                <Menu.Items as="ul" className={styles.menu}>
                    {categories.map((category) => (
                        <CategoryComponent category={category} key={category.id} />
                    ))}
                </Menu.Items>
            </>
        )}
    </Menu>
);

export default Categories;
