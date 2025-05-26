import type { TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';

import { Link } from '@/components/Link';
import type { ExternalNewsroomUrl } from '@/types';
import { ensureTrailingSlash } from '@/utils';

import { Badge } from '../Badge';

import styles from './CategoryLink.module.scss';

type Props = {
    category: TranslatedCategory;
    className?: string;
    external: ExternalNewsroomUrl;
    withBadge?: boolean;
};

export function CategoryLink({ category, className, external, withBadge = false }: Props) {
    const content = withBadge ? (
        <Badge variant="outline" size="small">
            {category.name}
        </Badge>
    ) : (
        <span>{category.name}</span>
    );

    const href = external
        ? `${ensureTrailingSlash(external.newsroomUrl)}${category.locale}/category/${category.slug}`
        : ({
              routeName: 'category',
              params: { slug: category.slug, localeCode: category.locale },
          } satisfies Link.Props['href']);

    return (
        <Link href={href} className={classNames(styles.link, className)}>
            {content}
        </Link>
    );
}
