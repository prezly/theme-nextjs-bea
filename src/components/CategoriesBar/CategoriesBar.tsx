import type { TranslatedCategory } from '@prezly/sdk';
import { FormattedMessage, translations } from '@prezly/theme-kit-nextjs';
import { useMeasure } from '@react-hookz/web';
import classNames from 'classnames';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { useLocale } from '@/adapters/client';

import { Dropdown } from '../Dropdown';
import { Link } from '../Link';

import { CategoryItem } from './CategoryItem';

import styles from './CategoriesBar.module.scss';

const MORE_BUTTON_WIDTH = +styles.MORE_BUTTON_WIDTH.replace('px', '');

type Props = {
    translatedCategories: TranslatedCategory[];
};

export function CategoriesBar({ translatedCategories }: Props) {
    const locale = useLocale();
    const params = useParams();
    const [measurements, containerRef] = useMeasure<HTMLDivElement>();
    const containerWidth = measurements?.width ?? 0;

    const [visibleCategories, hiddenCategories] = useMemo<
        [TranslatedCategory[], TranslatedCategory[]]
    >(() => {
        if (!containerRef.current) {
            return [translatedCategories, []];
        }

        const { paddingLeft, paddingRight } = getComputedStyle(containerRef.current);
        const containerWidthWithoutPadding =
            containerWidth - parseInt(paddingLeft) - parseInt(paddingRight);

        if (containerRef.current.scrollWidth <= containerWidthWithoutPadding) {
            return [translatedCategories, []];
        }

        let index = 0;
        let width = 0;
        const widthLimit = containerWidthWithoutPadding - MORE_BUTTON_WIDTH;
        const nodesArray = Array.from(containerRef.current.children);

        for (let i = 0; i < nodesArray.length; i += 1) {
            const { width: nodeWidth } = nodesArray[i].getBoundingClientRect();

            if (nodeWidth + width > widthLimit) {
                break;
            }
            width += nodeWidth;
            index = i + 1;
        }

        return [translatedCategories.slice(0, index), translatedCategories.slice(index)];
    }, [translatedCategories, containerRef, containerWidth]);

    if (!visibleCategories.length) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container} ref={containerRef}>
                {visibleCategories.map((category) => (
                    <Link
                        key={category.id}
                        href={{
                            routeName: 'category',
                            params: { localeCode: locale, slug: category.slug },
                        }}
                        className={classNames(styles.link, {
                            [styles.active]: category.slug === params.slug,
                        })}
                        title={category.description || undefined}
                    >
                        {category.name}
                    </Link>
                ))}
                {hiddenCategories.length > 0 && (
                    <Dropdown
                        label={<FormattedMessage locale={locale} for={translations.actions.more} />}
                        buttonClassName={styles.more}
                    >
                        {hiddenCategories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                localeCode={locale}
                            />
                        ))}
                    </Dropdown>
                )}
            </div>
        </div>
    );
}
