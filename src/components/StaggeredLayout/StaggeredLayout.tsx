'use client';

import classNames from 'classnames';
import { Children, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

import { useDevice } from '@/hooks';

import styles from './StaggeredLayout.module.scss';

type Props = {
    children: ReactNode;
    className?: string;
};

export function StaggeredLayout({ children, className }: Props) {
    const isLayoutInitializedRef = useRef(false);
    const { isMobile, isTablet } = useDevice();

    const columnCount = useMemo(() => {
        if (isMobile) {
            isLayoutInitializedRef.current = false;
            return 0;
        }

        // Only use the calculated layout if we're not on mobile screen
        isLayoutInitializedRef.current = true;

        if (isTablet) {
            return 2;
        }

        return 3;
    }, [isMobile, isTablet]);

    const childrenInColumns = useMemo(() => {
        const itemsCols = new Array(columnCount);
        const items = Children.toArray(children);

        items.forEach((item, i) => {
            const columnIndex = i % columnCount;

            if (!itemsCols[columnIndex]) {
                itemsCols[columnIndex] = [];
            }

            itemsCols[columnIndex].push(item);
        });

        return itemsCols;
    }, [children, columnCount]);

    if (!isLayoutInitializedRef.current) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            className={classNames(styles.container, className, {
                [styles.desktop]: columnCount === 3,
            })}
        >
            {childrenInColumns.map((columnItems, i) => (
                <div key={`column-${i}`}>{columnItems}</div>
            ))}
        </div>
    );
}
