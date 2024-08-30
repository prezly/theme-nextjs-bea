'use client';

import { translations } from '@prezly/theme-kit-nextjs';

import { useIntl } from '@/adapters/client';
import { PageTitle } from '@/components/PageTitle';

import { useSearchState } from './SearchStateContext';

export function Title() {
    const { formatMessage } = useIntl();
    const { searchState } = useSearchState();

    const { query: searchQuery } = searchState;

    return (
        <PageTitle
            title={
                searchQuery
                    ? formatMessage(translations.search.fullResultsTitle)
                    : formatMessage(translations.search.title)
            }
        />
    );
}
