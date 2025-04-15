import type { Category, TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';

import { Link } from '@/components/Link';
import { IconArrowRight } from '@/icons';
import type { ThemeSettings } from '@/theme-settings';

import { CategoryImage } from './CategoryImage';

import styles from './FeaturedCategory.module.scss';

export function FeaturedCategory({
    locale,
    image,
    name,
    slug,
    className,
    accentColor,
}: FeaturedCategory.Props) {
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
            <CategoryImage
                accentColor={accentColor}
                className={styles.image}
                image={image}
                name={name}
            />
            <div className={styles.label}>
                <div className={styles.categoryName}>
                    {name}
                    <IconArrowRight className={styles.icon} />
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
        accentColor: ThemeSettings['accent_color'];
    }
}
