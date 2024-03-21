import type { Category, TranslatedCategory } from '@prezly/sdk';

import { CategoryImage } from '@/components/CategoryImage';
import { Link } from '@/components/Link';

import styles from './FeaturedCategory.module.scss';

export function FeaturedCategory({ locale, image, name, slug }: FeaturedCategory.Props) {
    return (
        <Link
            className={styles.link}
            href={{
                routeName: 'category',
                params: {
                    slug,
                    localeCode: locale,
                },
            }}
        >
            <CategoryImage className={styles.image} image={image} name={name} size="big" />
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
    }
}
