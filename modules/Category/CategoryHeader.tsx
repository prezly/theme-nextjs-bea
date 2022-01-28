import type { Category } from '@prezly/sdk';
import { getLocalizedCategoryData, useCurrentLocale } from '@prezly/theme-kit-nextjs';
import type { FunctionComponent } from 'react';

import { PageTitle } from '@/components';

type Props = {
    category: Category;
};

const CategoryHeader: FunctionComponent<Props> = ({ category }) => {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);

    return <PageTitle title={name} subtitle={description} />;
};

export default CategoryHeader;
