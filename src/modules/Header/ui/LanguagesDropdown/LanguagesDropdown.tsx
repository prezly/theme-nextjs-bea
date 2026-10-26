'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { useBasePathConfig } from '@/adapters/client';
import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { IconGlobe } from '@/icons';
import { analytics, isReverseProxyConfigured } from '@/utils';

import styles from './LanguagesDropdown.module.scss';

export function LanguagesDropdown({
    selected,
    options,
    buttonClassName,
    navigationItemClassName,
}: LanguagesDropdown.Props) {
    const selectedOption = options.find((option) => option.code === selected);

    const displayedOptions = [...options].sort((a, b) => a.title.localeCompare(b.title));

    // Language links target the bare /<locale>/news index. Behind a reverse proxy
    // that trailing-slash-redirects that path, an RSC soft-nav wouldn't refresh
    // the page — so force a full navigation (the href is a pre-generated string,
    // so this can't be auto-detected in Link). No-op for normal deployments.
    const basePathConfig = useBasePathConfig();
    const forceRefresh = isReverseProxyConfigured(basePathConfig);

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
                        forceRefresh={forceRefresh}
                        withMobileDisplay
                        className={classNames({
                            [styles.disabled]: code === selected,
                        })}
                        onClick={() => analytics.track(ACTIONS.SWITCH_LANGUAGE, { code })}
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
