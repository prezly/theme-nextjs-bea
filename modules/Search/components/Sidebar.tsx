import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';

import Button from '@/components/Button';
import { IconFilter } from '@/icons';

import { AVAILABLE_FACET_ATTRIBUTES, CATEGORY_ATTRIBUTE } from '../utils';

import Facet from './Facet';
import SearchInput from './SearchInput';

import styles from './Sidebar.module.scss';

const Sidebar: FunctionComponent = () => {
    const [isShown, setIsShown] = useState(false);

    const toggleFacets = () => setIsShown((s) => !s);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <SearchInput />
                <Button
                    variation="secondary"
                    icon={IconFilter}
                    title="Toggle filters"
                    onClick={toggleFacets}
                    className={styles.button}
                />
            </div>
            <div className={classNames(styles.facets, { [styles.facetsOpen]: isShown })}>
                {AVAILABLE_FACET_ATTRIBUTES.map((attribute) => (
                    <Facet key={attribute} attribute={attribute} />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
