import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import React, { FunctionComponent, ReactChild, SVGProps } from 'react';

import Button from '@/components/Button';

import Item from './DropdownItem';

import styles from './Dropdown.module.scss';

type Props = {
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    label: ReactChild;
    className?: string;
    menuClassName?: string;
};

const Dropdown: FunctionComponent<Props> = ({
    icon,
    label,
    className,
    menuClassName,
    children,
}) => (
    <Menu as="div" className={classNames(styles.container, className)}>
        {({ open }) => (
            <>
                <Menu.Button as={React.Fragment}>
                    <Button variation="navigation" isActive={open} icon={icon}>
                        {label}
                    </Button>
                </Menu.Button>
                <Menu.Items as="ul" className={classNames(styles.menu, menuClassName)}>
                    {children}
                </Menu.Items>
            </>
        )}
    </Menu>
);

export default Object.assign(Dropdown, {
    Item,
});
