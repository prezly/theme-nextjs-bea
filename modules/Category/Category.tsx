import { Category } from '@prezly/sdk/dist/types';

type Props = {
    category: Category
};

const CategoryComponent = ({ category }: Props) => <span>{category.display_name}</span>;

export default CategoryComponent;
