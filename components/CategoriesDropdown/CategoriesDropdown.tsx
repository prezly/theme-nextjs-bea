import type { Category } from '@prezly/sdk/dist/types';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Dropdown from '@/components/Dropdown';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { IconMenu } from '@/icons';
import { getCategoryHasTranslation } from '@/utils/prezly';

import CategoryItem from './CategoryItem';

type Props = {
    categories: Category[];
};

const messages = defineMessages({
    categories: {
        defaultMessage: 'Categories',
    },
});

const CategoriesDropdown: FunctionComponent<Props> = ({ categories }) => {
    const currentLocale = useCurrentLocale();

    const filteredCategories = categories.filter(
        (category) =>
            category.stories_number > 0 && getCategoryHasTranslation(category, currentLocale),
    );

    return (
        <Dropdown icon={IconMenu} label={<FormattedMessage {...messages.categories} />}>
            {filteredCategories.map((category) => (
                <CategoryItem category={category} key={category.id} />
            ))}
        </Dropdown>
    );
};

export default CategoriesDropdown;
