import type { TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';

import { Link } from '@/components/Link';

import styles from './CategoryLink.module.scss';

type Props = {
    category: TranslatedCategory;
    className?: string;
};

export function CategoryLink({ category, className }: Props) {
    return (
        <Link
            href={{
                routeName: 'category',
                params: { slug: category.slug, localeCode: category.locale },
            }}
            className={classNames(styles.link, className)}
        >
            <span>{category.name}</span>
        </Link>
    );
}
