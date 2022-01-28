import type { Category } from '@prezly/sdk';
import {
    AlgoliaCategoryRef,
    getCategoryUrl,
    getLocalizedCategoryData,
    useCurrentLocale,
    useGetLinkLocaleSlug,
} from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';

import styles from './CategoryLink.module.scss';

type Props = {
    category: Category | AlgoliaCategoryRef;
    className?: string;
};

const CategoryLink: FunctionComponent<Props> = ({ category, className }) => {
    const currentLocale = useCurrentLocale();
    const { name } = getLocalizedCategoryData(category, currentLocale);
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <Link href={getCategoryUrl(category, currentLocale)} locale={getLinkLocaleSlug()} passHref>
            <a className={classNames(styles.link, className)}>
                <span>{name}</span>
            </a>
        </Link>
    );
};

export default CategoryLink;
