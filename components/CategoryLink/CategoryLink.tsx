import type { TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';

import { Link } from '@/components/Link';

import { Badge } from '../Badge';

import styles from './CategoryLink.module.scss';

type Props = {
    category: TranslatedCategory;
    className?: string;
    withBadge?: boolean;
};

export function CategoryLink({ category, className, withBadge = false }: Props) {
    const content = withBadge ? (
        <Badge variant="outline" size="small">
            {category.name}
        </Badge>
    ) : (
        <span>{category.name}</span>
    );

    return (
        <Link
            href={{
                routeName: 'category',
                params: { slug: category.slug, localeCode: category.locale },
            }}
            className={classNames(styles.link, className)}
        >
            {content}
        </Link>
    );
}
