import { ButtonLink } from '@/components/Button';
import type { TranslatedCategory } from '@/theme-kit/domain';

import styles from './CategoryItem.module.scss';

export function CategoryButton({ category, className }: CategoryButton.Props) {
    return (
        <ButtonLink
            className={className}
            href={{
                routeName: 'category',
                params: { slug: category.slug, localeCode: category.code },
            }}
            variation="navigation"
        >
            <span className={styles.title}>{category.name}</span>
            {category.description && (
                <span className={styles.description}>{category.description}</span>
            )}
        </ButtonLink>
    );
}

export namespace CategoryButton {
    export interface Props {
        category: TranslatedCategory;
        className?: string;
    }
}
