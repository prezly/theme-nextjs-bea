import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';

const AlgoliaStateContext = createContext<StateResultsProvided<AlgoliaStory> | undefined>(
    undefined,
);

// Algolia connect API is pretty broken, so this is a workaround to provide some search state to components lower in the tree
function AlgoliaStateContextProvider({
    children,
    ...contextValue
}: PropsWithChildren<StateResultsProvided<AlgoliaStory>>) {
    return (
        <AlgoliaStateContext.Provider value={contextValue}>{children}</AlgoliaStateContext.Provider>
    );
}

export default connectStateResults(AlgoliaStateContextProvider);

export function useAlgoliaState() {
    const state = useContext(AlgoliaStateContext);

    if (!state) {
        throw new Error(
            '`useAlgoliaState` should only be used inside `AlgoliaStateContextProvider`',
        );
    }

    return state;
}
