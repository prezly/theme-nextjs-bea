import { Category } from '@prezly/sdk/dist/types';
import Link from 'next/link';

type Props = {
    category: Category
};

const CategoryComponent = ({ category }: Props) => {
    // Use first available locale with a slug
    // Change this for multilang support
    const locales = Object.keys(category.i18n);
    const locale = locales.filter((l) => !!category.i18n[l].slug)[0] || locales[0];

    return (
        <Link href={`/category/${category.i18n[locale].slug}`}>
            <a>{category.display_name}</a>
        </Link>
    );
};

export default CategoryComponent;
