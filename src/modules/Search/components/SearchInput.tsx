'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import { useDebouncedCallback } from '@react-hookz/web';
import type { ChangeEvent } from 'react';
import type { SearchBoxExposed, SearchBoxProvided } from 'react-instantsearch-core';
import { connectSearchBox } from 'react-instantsearch-dom';

import { useIntl, useLocale, useRouting } from '@/adapters/client';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { IconSearch } from '@/icons';
import { analytics } from '@/utils';

import styles from './SearchInput.module.scss';

export const SearchInput = connectSearchBox(
    ({ currentRefinement, refine }: SearchBoxProvided & SearchBoxExposed) => {
        const localeCode = useLocale();
        const { generateUrl } = useRouting();
        const { formatMessage } = useIntl();

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
                <FormInput
                    label={formatMessage(translations.search.inputLabel)}
                    type="search"
                    name="query"
                    value={currentRefinement}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={formatMessage(translations.search.inputHint, {
                        inputHintExtra: '',
                    })}
                    autoComplete="off"
                />
                <Button
                    type="submit"
                    variation="secondary"
                    className={styles.button}
                    title={formatMessage(translations.search.action)}
                    icon={IconSearch}
                />
            </form>
        );
    },
);

SearchInput.displayName = 'SearchInput';
