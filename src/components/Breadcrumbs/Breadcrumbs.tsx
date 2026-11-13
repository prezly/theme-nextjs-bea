import { Link } from '@/components/Link';

import styles from './Breadcrumbs.module.scss';

/**
 * The way from the homepage to the current page: Newsroom › Cars › Models › EQS.
 * The last item is the current page, and is not a link.
 */
export function Breadcrumbs({ items, label }: Breadcrumbs.Props) {
    return (
        <nav aria-label={label} className={styles.breadcrumbs}>
            <ol className={styles.list}>
                {items.map((item, index) => {
                    const isCurrent = index === items.length - 1;

                    return (
                        <li key={item.key} className={styles.item}>
                            {isCurrent || !item.href ? (
                                <span aria-current={isCurrent ? 'page' : undefined}>
                                    {item.name}
                                </span>
                            ) : (
                                <Link className={styles.link} href={item.href}>
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export namespace Breadcrumbs {
    export interface Item {
        key: string | number;
        name: string;
        href?: Link.Props['href'];
    }

    export interface Props {
        items: Item[];
        /**
         * Tells screen reader users what this navigation is.
         */
        label: string;
    }
}
