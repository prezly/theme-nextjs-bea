import type { Category } from '@prezly/sdk/dist/types';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Dropdown } from '@/components';
import { useCurrentLocale } from '@/hooks';
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

    if (filteredCategories.length === 0) {
        return null;
    }

    return (
        <Dropdown label={<FormattedMessage {...messages.categories} />}>
            {filteredCategories.map((category) => (
                <CategoryItem category={category} key={category.id} />
            ))}
        </Dropdown>
    );
};

export default CategoriesDropdown;
