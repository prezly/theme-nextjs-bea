'use client';

import { translations } from '@prezly/theme-kit-nextjs';
import type { SearchBoxExposed, SearchBoxProvided } from 'react-instantsearch-core';
import { connectSearchBox } from 'react-instantsearch-dom';

import { FormattedMessage, useLocale, useRouting } from '@/adapters/client';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';

import styles from './SearchBar.module.scss';

type Props = SearchBoxProvided & SearchBoxExposed;

export const SearchBar = connectSearchBox(({ currentRefinement, refine }: Props) => {
    const localeCode = useLocale();
    const { generateUrl } = useRouting();

    return (
        <form
            className={styles.container}
            method="GET"
            action={generateUrl('search', { localeCode })}
        >
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
