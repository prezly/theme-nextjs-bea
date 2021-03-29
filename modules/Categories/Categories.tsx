import React from 'react';
import type { Category } from '@prezly/sdk/dist/types';
import CategoryComponent from '../Category';

type Props = {
    categories: Category[]
};

const Categories = ({ categories }: Props) => (
    <ul>
        {categories.map((c) => (
            <li key={c.id}>
                <CategoryComponent category={c} />
            </li>
        ))}
    </ul>
);

export default Categories;
