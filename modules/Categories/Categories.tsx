import type { Category } from '@prezly/sdk/dist/types';
import React, { FunctionComponent } from 'react';

import CategoryComponent from '../Category';

type Props = {
    categories: Category[];
};

const Categories: FunctionComponent<Props> = ({ categories }) => (
    <ul>
        {categories.map((c) => (
            <li key={c.id}>
                <CategoryComponent category={c} />
            </li>
        ))}
    </ul>
);

export default Categories;
