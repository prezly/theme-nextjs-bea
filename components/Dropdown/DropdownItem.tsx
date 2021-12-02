import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { LinkProps } from 'next/link';
import React, { FunctionComponent } from 'react';

import DropdownLink from './DropdownLink';

import styles from './DropdownItem.module.scss';

type Props = Pick<LinkProps, 'href' | 'locale'> & {
    className?: string;
    linkClassName?: string;
    forceRefresh?: boolean;
    withMobileDisplay?: boolean;
};

const DropdownItem: FunctionComponent<Props> = ({
    href,
    locale,
    className,
    linkClassName,
    forceRefresh,
    withMobileDisplay,
    children,
}) => (
    <Menu.Item
        as="li"
        className={classNames(styles.item, className, {
            [styles.withMobileDisplay]: withMobileDisplay,
        })}
    >
        {({ active }) => (
            <DropdownLink
                href={href}
                locale={locale}
                className={classNames(styles.link, linkClassName, {
                    [styles.active]: active,
                })}
                forceRefresh={forceRefresh}
            >
                {children}
            </DropdownLink>
        )}
    </Menu.Item>
);

export default DropdownItem;
