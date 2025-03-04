'use client';

import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

import { Button, type ButtonProps } from '@/components/Button';
import type { IconComponentType } from '@/icons';
import { IconCaret } from '@/icons';

import styles from './Dropdown.module.scss';

export function Dropdown({
    icon,
    label,
    className,
    menuClassName,
    buttonClassName,
    buttonContentClassName,
    withMobileDisplay,
    forceOpen = false,
    children,
    variation = 'navigation',
}: Dropdown.Props) {
    return (
        <Menu as="div" className={classNames(styles.container, className)}>
            {({ open }) => (
                <>
                    <MenuButton as={Fragment}>
                        <Button
                            variation={variation}
                            icon={icon}
                            className={classNames(buttonClassName, {
                                [styles.buttonWithMobileDisplay]: withMobileDisplay,
                            })}
                            contentClassName={buttonContentClassName}
                        >
                            {label}
                            {!forceOpen && (
                                <IconCaret
                                    width={12}
                                    height={12}
                                    className={classNames(styles.caret, {
                                        [styles.caretOpen]: open,
                                    })}
                                />
                            )}
                        </Button>
                    </MenuButton>
                    {forceOpen && (
                        <MenuItems
                            static
                            as="ul"
                            className={classNames(styles.menu, menuClassName, {
                                [styles.withMobileDisplay]: withMobileDisplay,
                            })}
                        >
                            {children}
                        </MenuItems>
                    )}
                    {!forceOpen && (
                        <Transition
                            as={Fragment}
                            enter={styles.transition}
                            enterFrom={styles.transitionOpenStart}
                            enterTo={styles.transitionOpenFinish}
                            leave={styles.transition}
                            leaveFrom={styles.transitionOpenFinish}
                            leaveTo={styles.transitionOpenStart}
                        >
                            <MenuItems
                                as="ul"
                                className={classNames(styles.menu, menuClassName, {
                                    [styles.withMobileDisplay]: withMobileDisplay,
                                })}
                            >
                                {children}
                            </MenuItems>
                        </Transition>
                    )}
                </>
            )}
        </Menu>
    );
}

export namespace Dropdown {
    export type Props = {
        icon?: IconComponentType;
        label: ReactNode;
        children?: ReactNode;
        className?: string;
        menuClassName?: string;
        buttonClassName?: string;
        withMobileDisplay?: boolean;
        buttonContentClassName?: string;
        forceOpen?: boolean;
        variation?: ButtonProps['variation'];
    };
}
