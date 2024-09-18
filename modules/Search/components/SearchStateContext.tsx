'use client';

import type { Search } from '@prezly/theme-kit-nextjs';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';

const SearchStateContext = createContext<StateResultsProvided<Search.IndexedStory> | undefined>(
    undefined,
);

function SearchStateContextProvider({
    children,
    ...contextValue
}: PropsWithChildren<StateResultsProvided<Search.IndexedStory>>) {
    return (
        <SearchStateContext.Provider value={contextValue}>{children}</SearchStateContext.Provider>
    );
}

export default connectStateResults(SearchStateContextProvider);

export function useSearchState() {
    const state = useContext(SearchStateContext);

    if (!state) {
        throw new Error('`useSearchState` should only be used inside `SearchStateContextProvider`');
    }

    return state;
}
