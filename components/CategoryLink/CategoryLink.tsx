import type { Category } from '@prezly/sdk';
import type { AlgoliaCategoryRef } from '@prezly/theme-kit-core';
import { getCategoryUrl, getLocalizedCategoryData } from '@prezly/theme-kit-core';
import { useCurrentLocale, useGetLinkLocaleSlug } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import Link from 'next/link';

import styles from './CategoryLink.module.scss';

type Props = {
    category: Category | AlgoliaCategoryRef;
    className?: string;
};

export function CategoryLink({ category, className }: Props) {
    const currentLocale = useCurrentLocale();
    const { name } = getLocalizedCategoryData(category, currentLocale);
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <Link
            href={getCategoryUrl(category, currentLocale)}
            locale={getLinkLocaleSlug()}
            passHref
            legacyBehavior
        >
            <a className={classNames(styles.link, className)}>
                <span>{name}</span>
            </a>
        </Link>
    );
}
