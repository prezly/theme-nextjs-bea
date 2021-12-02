import { Category } from '@prezly/sdk';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';

import { useCurrentLocale, useGetLinkLocale } from '@/hooks';
import { getCategoryUrl, getLocalizedCategoryData } from '@/utils/prezly';

import styles from './CategoryLink.module.scss';

type Props = {
    category: Category;
};

const CategoryLink: FunctionComponent<Props> = ({ category }) => {
    const currentLocale = useCurrentLocale();
    const { name } = getLocalizedCategoryData(category, currentLocale);
    const getLinkLocale = useGetLinkLocale();

    return (
        <Link href={getCategoryUrl(category, currentLocale)} locale={getLinkLocale()} passHref>
            <a className={styles.link}>
                <span>{name}</span>
            </a>
        </Link>
    );
};

export default CategoryLink;
