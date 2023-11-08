'use client';

import classNames from 'classnames';
import type { ReactNode } from 'react';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { IconGlobe } from '@/icons';

import type { LanguageDisplayProps } from './types';

import styles from './LanguagesDropdown.module.scss';

export interface Props {
    children: ReactNode;
    selected: LanguageDisplayProps['code'];
    options: LanguageDisplayProps[];
    buttonClassName?: string;
    navigationItemClassName?: string;
}

export function LanguagesDropdown({
    children,
    selected,
    options,
    buttonClassName,
    navigationItemClassName,
}: Props) {
    return (
        <li className={navigationItemClassName}>
            <Dropdown
                icon={IconGlobe}
                label={children}
                className={styles.container}
                menuClassName={styles.menu}
                buttonClassName={classNames(buttonClassName, styles.button)}
                withMobileDisplay
            >
                {options.map(({ code, href, title }) => (
                    <DropdownItem
                        key={code}
                        href={href}
                        forceRefresh
                        withMobileDisplay
                        className={classNames({
                            [styles.disabled]: code === selected,
                        })}
                    >
                        {title}
                    </DropdownItem>
                ))}
            </Dropdown>
        </li>
    );
}
