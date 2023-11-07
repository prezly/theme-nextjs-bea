import { ButtonLink } from '@/ui';

import type { CategoryDisplayProps } from './types';

import styles from './CategoryItem.module.scss';

export function CategoryButton({ category, className }: CategoryButton.Props) {
    return (
        <ButtonLink variation="navigation" href={category.href} className={className}>
            <span className={styles.title}>{category.name}</span>
            {category.description && (
                <span className={styles.description}>{category.description}</span>
            )}
        </ButtonLink>
    );
}

export namespace CategoryButton {
    export interface Props {
        category: CategoryDisplayProps;
        className?: string;
    }
}
