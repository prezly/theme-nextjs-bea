import type { Category } from '@prezly/sdk/dist/types';
import { FormattedMessage, type Locale, translations, useIntl } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { PageTitle } from '@/components/PageTitle';

import styles from './CategoriesFilters.module.scss';

interface Props {
    activeCategory: Pick<Category, 'id'> | undefined;
    categories: Category[];
    className?: string;
    hasStories: boolean;
    locale: Locale.Code;
}

export function CategoriesFilters({
    activeCategory,
    categories,
    className,
    hasStories,
    locale,
}: Props) {
    const { formatMessage } = useIntl();

    return (
        <div className={className}>
            <PageTitle
                className={classNames(styles.title, {
                    // Hide the title for regular visitors if there's no stories,
                    // but keep it for screen readers
                    [styles.aria]: !hasStories,
                })}
                title={formatMessage(translations.homepage.latestStories)}
            />
            {categories.length > 0 && (
                <div className={styles.filters}>
                    <Filter isActive={activeCategory === undefined}>
                        <FormattedMessage locale={locale} for={translations.homepage.allStories} />
                    </Filter>
                    {categories.map(({ id, display_name, i18n }) => (
                        <Filter categoryId={id} isActive={activeCategory?.id === id} key={id}>
                            {i18n[locale]?.name || display_name}
                        </Filter>
                    ))}
                </div>
            )}
        </div>
    );
}

export function Filter(props: {
    categoryId?: Category['id'];
    children: ReactNode;
    isActive: boolean;
}) {
    const { categoryId, children, isActive } = props;

    return (
        <Link
            href={categoryId ? { query: { category: categoryId } } : { query: { category: null } }}
            className={classNames(styles.badge, {
                [styles.active]: isActive,
            })}
            scroll={false}
        >
            {children}
        </Link>
    );
}
