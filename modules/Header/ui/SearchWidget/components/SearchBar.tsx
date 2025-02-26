'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import { useDebouncedCallback } from '@react-hookz/web';
import type { ChangeEvent } from 'react';
import type { SearchBoxExposed, SearchBoxProvided } from 'react-instantsearch-core';
import { connectSearchBox } from 'react-instantsearch-dom';

import { FormattedMessage, useLocale, useRouting } from '@/adapters/client';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { analytics } from '@/utils';

import styles from './SearchBar.module.scss';

type Props = SearchBoxProvided & SearchBoxExposed;

export const SearchBar = connectSearchBox(({ currentRefinement, refine }: Props) => {
    const localeCode = useLocale();
    const { generateUrl } = useRouting();

    const trackQuery = useDebouncedCallback(
        (query: string) => {
            analytics.track(ACTIONS.SEARCH, { query });
        },
        [],
        500,
    );

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const query = event.currentTarget.value;

        refine(query);
        trackQuery(query);
    }

    return (
        <form
            className={styles.container}
            method="GET"
            action={generateUrl('search', { localeCode })}
        >
            <div className={styles.inputWrapper}>
                <FormInput
                    label={
                        <FormattedMessage
                            locale={localeCode}
                            for={translations.search.inputLabel}
                        />
                    }
                    type="search"
                    name="query"
                    value={currentRefinement}
                    onChange={handleChange}
                    className={styles.input}
                    autoComplete="off"
                />
                {!currentRefinement.length && (
                    <span className={styles.inputHint}>
                        <FormattedMessage locale={localeCode} for={translations.search.inputHint} />
                    </span>
                )}
            </div>
            <Button type="submit" variation="secondary" className={styles.button}>
                <FormattedMessage locale={localeCode} for={translations.search.action} />
            </Button>
        </form>
    );
});

SearchBar.displayName = 'SearchBar';
