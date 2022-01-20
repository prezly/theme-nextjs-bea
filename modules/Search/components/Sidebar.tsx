import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';

import Button from '@/components/Button';
import { IconFilter } from '@/icons';

import { CATEGORY_ATTRIBUTE } from '../utils';

import Facet from './Facet';
import SearchInput from './SearchInput';

import styles from './Sidebar.module.scss';

interface Props {}

const Sidebar: FunctionComponent<Props> = () => {
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
                <Facet attribute={CATEGORY_ATTRIBUTE} />
                <Facet attribute="attributes.published_at" />
            </div>
        </div>
    );
};

export default Sidebar;
