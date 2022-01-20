import { Disclosure } from '@headlessui/react';
import { FunctionComponent, useMemo, useState } from 'react';
import type { RefinementListExposed, RefinementListProvided } from 'react-instantsearch-core';
import { connectRefinementList } from 'react-instantsearch-dom';

import Button from '@/components/Button';

import styles from './Facet.module.scss';

const DEFAULT_FACETS_LIMIT = 7;

const Facet: FunctionComponent<RefinementListProvided & RefinementListExposed> = ({
    attribute,
    items,
    refine,
}) => {
    const [isExtended, setIsExtended] = useState(false);
    const visibleItems = useMemo(
        () => items.slice(0, isExtended ? undefined : DEFAULT_FACETS_LIMIT),
        [isExtended, items],
    );

    const toggleList = () => setIsExtended((i) => !i);

    return (
        <Disclosure as="div" className={styles.container} defaultOpen>
            {({ open }) => (
                <>
                    <Disclosure.Button className={styles.header}>
                        {attribute} ({open ? 'opened' : 'closed'})
                    </Disclosure.Button>
                    <Disclosure.Panel className={styles.panel}>
                        <ul className={styles.list}>
                            {visibleItems.map((item) => (
                                <li key={item.objectID} className={styles.listItem}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={item.isRefined}
                                            onChange={() => refine(item.value)}
                                        />
                                        <span>{item.label}</span>
                                        <span>({item.count})</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                        {items.length > DEFAULT_FACETS_LIMIT && (
                            <Button
                                onClick={toggleList}
                                variation="navigation"
                                className={styles.link}
                            >
                                {isExtended ? 'View less' : 'View more'}
                            </Button>
                        )}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default connectRefinementList(Facet);
