import { Category } from '@prezly/sdk/dist/types';
import Link from 'next/link';

type Props = {
    category: Category
};

const CategoryComponent = ({ category }: Props) => (
    <Link href={`/category/${category.display_name}`}>
        <a>{category.display_name}</a>
    </Link>
);

export default CategoryComponent;
