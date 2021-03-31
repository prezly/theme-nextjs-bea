import React from 'react';
import { Category as CategoryType } from '@prezly/sdk/dist/types';
import Category from '../Category';

type Props = {
    categories: CategoryType[]
};

const Categories = ({ categories }: Props) => (
    <ul>
        {categories.map((c) => (
            <React.Fragment key={c.id}>
                <Category category={c} />
            </React.Fragment>
        ))}
    </ul>
);

export default Categories;
