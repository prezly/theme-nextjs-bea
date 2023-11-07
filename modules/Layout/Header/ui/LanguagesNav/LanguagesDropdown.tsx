'use client';

import classNames from 'classnames';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { IconGlobe } from '@/icons';

import type { LanguageDisplayProps } from './types';

import styles from './LanguagesDropdown.module.scss';

export interface Props {
    selected: LanguageDisplayProps;
    options: LanguageDisplayProps[];
    buttonClassName?: string;
    navigationItemClassName?: string;
}

export function LanguagesDropdown({
    selected,
    options,
    buttonClassName,
    navigationItemClassName,
}: Props) {
    return (
        <li className={navigationItemClassName}>
            <Dropdown
                icon={IconGlobe}
                label={selected.title}
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
                            [styles.disabled]: code === selected.code,
                        })}
                    >
                        {title}
                    </DropdownItem>
                ))}
            </Dropdown>
        </li>
    );
}
