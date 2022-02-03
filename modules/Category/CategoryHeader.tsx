import type { Category } from '@prezly/sdk';
import { getLocalizedCategoryData, useCurrentLocale } from '@prezly/theme-kit-nextjs';

import { PageTitle } from '@/components';

type Props = {
    category: Category;
};

function CategoryHeader({ category }: Props) {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);

    return <PageTitle title={name} subtitle={description} />;
}

export default CategoryHeader;
