import type { TranslatedCategory } from '@prezly/sdk';

import { Badge } from '@/components/Badge';
import { Link } from '@/components/Link';
import { categoryPath } from '@/utils';

import styles from './Subcategories.module.scss';

/**
 * Links to the categories directly under the current one. The menu shows two levels, so for a
 * third level this list is the way in.
 */
export function Subcategories({ categories, label }: Subcategories.Props) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <nav aria-label={label} className={styles.subcategories}>
            <ul className={styles.list}>
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link
                            className={styles.link}
                            href={{
                                routeName: 'category',
                                params: {
                                    path: categoryPath(category),
                                    localeCode: category.locale,
                                },
                            }}
                            title={category.description || undefined}
                        >
                            <Badge variant="outline" size="small">
                                {category.name}
                            </Badge>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export namespace Subcategories {
    export interface Props {
        categories: TranslatedCategory[];
        /**
         * Tells screen reader users what this navigation is.
         */
        label: string;
    }
}
