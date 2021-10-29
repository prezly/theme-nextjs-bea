import type { Category } from '@prezly/sdk/dist/types';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Dropdown from '@/components/Dropdown';
import { IconMenu } from '@/icons';

import CategoryItem from './CategoryItem';

type Props = {
    categories: Category[];
};

const messages = defineMessages({
    categories: {
        defaultMessage: 'Categories',
    },
});

const CategoriesDropdown: FunctionComponent<Props> = ({ categories }) => (
    <Dropdown icon={IconMenu} label={<FormattedMessage {...messages.categories} />}>
        {categories.map((category) => (
            <CategoryItem category={category} key={category.id} />
        ))}
    </Dropdown>
);

export default CategoriesDropdown;
