import { Category } from '@prezly/sdk/dist/types';
import Link from 'next/link';

type Props = {
    category: Category
};

const CategoryComponent = ({ category }: Props) => {
    // Use first available locale
    // Change this for multilang support
    const locale = Object.keys(category.i18n)[0];

    return (
        <Link href={`/category/${category.i18n[locale].slug}`}>
            <a>{category.display_name}</a>
        </Link>
    );
};

export default CategoryComponent;
