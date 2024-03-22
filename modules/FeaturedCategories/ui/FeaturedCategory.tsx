import type { Category, TranslatedCategory } from '@prezly/sdk';

import { CategoryImage } from './CategoryImage';
import { Link } from '@/components/Link';

import styles from './FeaturedCategory.module.scss';
import classNames from 'classnames';

export function FeaturedCategory({ locale, image, name, slug, className }: FeaturedCategory.Props) {
    return (
        <Link
            className={classNames(styles.link, className)}
            href={{
                routeName: 'category',
                params: {
                    slug,
                    localeCode: locale,
                },
            }}
        >
            <CategoryImage className={styles.image} image={image} name={name} />
            {name}
        </Link>
    );
}

export namespace FeaturedCategory {
    export interface Props {
        image: Category['image'];
        name: TranslatedCategory['name'];
        slug: TranslatedCategory['slug'];
        locale: TranslatedCategory['locale'];
        className: string;
    }
}
