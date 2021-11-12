import { Category } from '@prezly/sdk';
import type { FunctionComponent } from 'react';

import { PageTitle } from '@/components';
import { useCurrentLocale } from '@/hooks';
import { getLocalizedCategoryData } from '@/utils/prezly';

type Props = {
    category: Category;
};

const CategoryHeader: FunctionComponent<Props> = ({ category }) => {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);

    return <PageTitle title={name} subtitle={description} />;
};

export default CategoryHeader;
