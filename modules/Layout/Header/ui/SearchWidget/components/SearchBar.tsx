'use client';

import { translations } from '@prezly/theme-kit-intl';
import type { SearchBoxExposed, SearchBoxProvided } from 'react-instantsearch-core';
import { connectSearchBox } from 'react-instantsearch-dom';

import { FormattedMessage } from '@/theme-kit/intl/client';
import { useRouting } from '@/theme-kit/useRouting';
import { Button, FormInput } from '@/ui';

import styles from './SearchBar.module.scss';

type Props = SearchBoxProvided & SearchBoxExposed;

export const SearchBar = connectSearchBox(({ currentRefinement, refine }: Props) => {
    const { generateUrl } = useRouting();

    // FIXME: Check if `action` has current locale always set

    return (
        <form className={styles.container} method="GET" action={generateUrl('search')}>
            <div className={styles.inputWrapper}>
                <FormInput
                    label={<FormattedMessage for={translations.search.inputLabel} />}
                    type="search"
                    name="query"
                    value={currentRefinement}
                    onChange={(event) => refine(event.currentTarget.value)}
                    className={styles.input}
                    autoComplete="off"
                />
                {!currentRefinement.length && (
                    <span className={styles.inputHint}>
                        <FormattedMessage for={translations.search.inputHint} />
                    </span>
                )}
            </div>
            <Button type="submit" variation="secondary" className={styles.button}>
                <FormattedMessage for={translations.search.action} />
            </Button>
        </form>
    );
});

SearchBar.displayName = 'SearchBar';
