'use client';

import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { Link } from '@/components/Link';

import styles from './DropdownItem.module.scss';

export function DropdownItem({
    href,
    className,
    linkClassName,
    forceRefresh,
    withMobileDisplay,
    children,
}: DropdownItem.Props) {
    return (
        <Menu.Item
            as="li"
            className={classNames(styles.item, className, {
                [styles.withMobileDisplay]: withMobileDisplay,
            })}
        >
            {({ active, close }) => (
                <Link
                    href={href}
                    className={classNames(styles.link, linkClassName, {
                        [styles.active]: active,
                    })}
                    forceRefresh={forceRefresh}
                    onClick={close}
                >
                    {children}
                </Link>
            )}
        </Menu.Item>
    );
}

export namespace DropdownItem {
    export type Props = Pick<Link.Props, 'href' | 'forceRefresh'> & {
        children?: ReactNode;
        className?: string;
        linkClassName?: string;
        withMobileDisplay?: boolean;
    };
}
