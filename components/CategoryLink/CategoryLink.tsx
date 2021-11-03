import { Category } from '@prezly/sdk';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';

import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { getCategoryUrl, getLocalizedCategoryData } from '@/utils/prezly';

import styles from './CategoryLink.module.scss';

type Props = {
    category: Category;
};

const CategoryLink: FunctionComponent<Props> = ({ category }) => {
    const currentLocale = useCurrentLocale();
    const { name } = getLocalizedCategoryData(category, currentLocale);

    return (
        <Link href={getCategoryUrl(category, currentLocale)} passHref>
            <a className={styles.link}>
                <span>{name}</span>
            </a>
        </Link>
    );
};

export default CategoryLink;
