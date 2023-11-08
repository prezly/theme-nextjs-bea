import classNames from 'classnames';

import { Link } from '@/components/Link';
import type { DisplayedCategory } from '@/theme-kit';

import styles from './CategoryLink.module.scss';

type Props = {
    category: DisplayedCategory;
    className?: string;
};

export function CategoryLink({ category, className }: Props) {
    return (
        <Link href={category.href} className={classNames(styles.link, className)}>
            <span>{category.name}</span>
        </Link>
    );
}
