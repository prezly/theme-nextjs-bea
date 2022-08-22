import { IconFilter } from '@prezly/icons';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { AVAILABLE_FACET_ATTRIBUTES } from '../utils';

import Facet from './Facet';
import SearchInput from './SearchInput';

import styles from './Sidebar.module.scss';

function Sidebar() {
    const { formatMessage } = useIntl();
    const [isShown, setIsShown] = useState(false);

    function toggleFacets() {
        return setIsShown((s) => !s);
    }

    return (
        <div className="relative mb-10">
            <div className={styles.header}>
                <SearchInput />
                <Button
                    variation="secondary"
                    icon={IconFilter}
                    title={formatMessage(translations.actions.toggleFilters)}
                    onClick={toggleFacets}
                    className={classNames(styles.button, 'dark:text-white')}
                />
            </div>
            <div
                className={classNames(
                    'dark:bg-gray-700 border dark:border-gray-600 p-0 rounded-lg lg:static lg:block lg:mt-0 empty:hidden lg:shadow-none',
                    'absolute left-0 right-0 top-full hidden mt-3 shadow-theme-m',
                    {
                        '!block z-[1]': isShown,
                    },
                )}
            >
                {AVAILABLE_FACET_ATTRIBUTES.map((attribute) => (
                    <Facet key={attribute} attribute={attribute} />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
