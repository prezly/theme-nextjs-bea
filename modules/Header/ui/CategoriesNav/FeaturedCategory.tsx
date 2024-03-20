import type { Category, TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';

import { type CardSize, CategoryImage } from '@/components/CategoryImage';
import { Link } from '@/components/Link';

import styles from './FeaturedCategory.module.scss';

export function FeaturedCategory({
    category,
    translatedCategory,
    size,
    className,
}: FeaturedCategory.Props) {
    return (
        <div className={classNames(className, styles.container)}>
            <Link
                className={styles.image}
                href={{
                    routeName: 'category',
                    params: {
                        slug: translatedCategory.slug,
                        localeCode: translatedCategory.locale,
                    },
                }}
            >
                <CategoryImage
                    category={category}
                    translatedCategory={translatedCategory}
                    size={size}
                />
            </Link>
            <Link
                className={styles.title}
                href={{
                    routeName: 'category',
                    params: {
                        slug: translatedCategory.slug,
                        localeCode: translatedCategory.locale,
                    },
                }}
            >
                <span>{translatedCategory.name}</span>
            </Link>
            {translatedCategory.description && (
                <span className={styles.description}>{translatedCategory.description}</span>
            )}
        </div>
    );
}

export namespace FeaturedCategory {
    export interface Props {
        className?: string;
        category: Category;
        translatedCategory: TranslatedCategory;
        size: CardSize;
    }
}
