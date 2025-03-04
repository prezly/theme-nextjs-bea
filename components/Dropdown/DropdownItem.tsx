'use client';

import { MenuItem } from '@headlessui/react';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { Link } from '@/components/Link';

import styles from './DropdownItem.module.scss';

export function DropdownItem({
    children,
    className,
    forceRefresh,
    href,
    linkClassName,
    onClick,
    withMobileDisplay,
}: DropdownItem.Props) {
    return (
        <MenuItem
            as="li"
            className={classNames(styles.item, className, {
                [styles.withMobileDisplay]: withMobileDisplay,
            })}
        >
            {({ focus, close }) => (
                <Link
                    href={href}
                    className={classNames(styles.link, linkClassName, {
                        [styles.active]: focus,
                    })}
                    forceRefresh={forceRefresh}
                    onClick={() => {
                        close();
                        onClick?.();
                    }}
                >
                    {children}
                </Link>
            )}
        </MenuItem>
    );
}

export namespace DropdownItem {
    export type Props = Pick<Link.Props, 'href' | 'forceRefresh'> & {
        children?: ReactNode;
        className?: string;
        linkClassName?: string;
        onClick?: () => void;
        withMobileDisplay?: boolean;
    };
}
