import { Category } from '@prezly/sdk';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';

import { getCategoryUrl } from '@/utils/prezly';

import styles from './CategoryLink.module.scss';

type Props = {
    category: Category;
};

const CategoryLink: FunctionComponent<Props> = ({ category }) => (
    <Link href={getCategoryUrl(category)} passHref>
        <a className={styles.link}>
            <span>{category.display_name}</span>
        </a>
    </Link>
);

export default CategoryLink;
