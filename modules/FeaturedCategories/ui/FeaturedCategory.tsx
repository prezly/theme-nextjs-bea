import type { Category, TranslatedCategory } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { FormattedMessage } from '@/adapters/client';
import { Link } from '@/components/Link';

import { CategoryImage } from './CategoryImage';

import styles from './FeaturedCategory.module.scss';

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
            <div className={styles.label}>
                <div className={styles.categoryName}>{name}</div>
                <div className={styles.viewLink}>
                    <FormattedMessage locale={locale} for={translations.search.viewMore} />
                    {' ->'}
                </div>
            </div>
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
