import React from 'react';
import Category from '../Category';

type Props = {
    categories: Category[]
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
