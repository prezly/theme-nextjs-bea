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
    onClick,
}: FeaturedCategory.Props) {
    return (
        <Link
            className={classNames(styles.link, className)}
            href={{
                routeName: 'category',
                params: {
                    slug: translatedCategory.slug,
                    localeCode: translatedCategory.locale,
                },
            }}
            onClick={onClick}
        >
            <CategoryImage
                className={styles.image}
                image={category.image}
                name={translatedCategory.name}
                size={size}
            />
            {translatedCategory.name}
        </Link>
    );
}

export namespace FeaturedCategory {
    export interface Props {
        className?: string;
        category: Category;
        translatedCategory: TranslatedCategory;
        size: CardSize;
        onClick?: () => void;
    }
}
