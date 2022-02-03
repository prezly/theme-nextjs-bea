import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import type { LinkProps } from 'next/link';
import type { PropsWithChildren } from 'react';

import DropdownLink from './DropdownLink';

import styles from './DropdownItem.module.scss';

type Props = Pick<LinkProps, 'href'> & {
    className?: string;
    linkClassName?: string;
    forceRefresh?: boolean;
    withMobileDisplay?: boolean;
    localeCode?: string | false;
};

function DropdownItem({
    href,
    localeCode,
    className,
    linkClassName,
    forceRefresh,
    withMobileDisplay,
    children,
}: PropsWithChildren<Props>) {
    return (
        <Menu.Item
            as="li"
            className={classNames(styles.item, className, {
                [styles.withMobileDisplay]: withMobileDisplay,
            })}
        >
            {({ active }) => (
                <DropdownLink
                    href={href}
                    localeCode={localeCode}
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
}

export default DropdownItem;
