import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { AVAILABLE_FACET_ATTRIBUTES } from '../utils';

import Facet from './Facet';
import SearchInput from './SearchInput';

import styles from './SearchBar.module.scss';

function Sidebar() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <SearchInput />
                </div>
                <div className={classNames(styles.facets)}>
                    <p className={styles.filters}>
                        <FormattedMessage {...translations.search.filters} />
                    </p>
                    {AVAILABLE_FACET_ATTRIBUTES.map((attribute) => (
                        <Facet key={attribute} attribute={attribute} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
