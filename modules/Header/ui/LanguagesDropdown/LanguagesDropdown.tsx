'use client';

import { ACTIONS, useAnalytics } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { IconGlobe } from '@/icons';

import styles from './LanguagesDropdown.module.scss';

export function LanguagesDropdown({
    selected,
    options,
    buttonClassName,
    navigationItemClassName,
}: LanguagesDropdown.Props) {
    const { track } = useAnalytics();
    const selectedOption = options.find((option) => option.code === selected);

    const displayedOptions = [...options].sort((a, b) => a.title.localeCompare(b.title));

    return (
        <li className={navigationItemClassName}>
            <Dropdown
                icon={IconGlobe}
                label={selectedOption?.title}
                menuClassName={styles.menu}
                buttonClassName={classNames(buttonClassName, styles.button)}
                withMobileDisplay
            >
                {displayedOptions.map(({ code, href, title }) => (
                    <DropdownItem
                        key={code}
                        href={href}
                        withMobileDisplay
                        className={classNames({
                            [styles.disabled]: code === selected,
                        })}
                        onClick={() => track(ACTIONS.SWITCH_LANGUAGE, { code })}
                    >
                        {title}
                    </DropdownItem>
                ))}
            </Dropdown>
        </li>
    );
}

export namespace LanguagesDropdown {
    export interface Option {
        code: Locale.Code;
        title: string;
        href: string;
    }

    export interface Props {
        selected?: Option['code'];
        options: Option[];
        buttonClassName?: string;
        navigationItemClassName?: string;
    }
}
