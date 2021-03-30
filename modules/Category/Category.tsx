import { DEFAULT_LOCALE } from '@/utils/constants';
import { Category } from '@prezly/sdk/dist/types';
import Link from 'next/link';

type Props = {
    category: Category
};

const CategoryComponent = ({ category }: Props) => (
    <Link href={`/category/${category.i18n[DEFAULT_LOCALE].slug}`}>
        <a>{category.i18n[DEFAULT_LOCALE].name}</a>
    </Link>
);

export default CategoryComponent;
