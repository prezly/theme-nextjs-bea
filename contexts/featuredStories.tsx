import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

import type { StoryWithImage } from 'types';

const FeaturedStoriesContext = createContext<StoryWithImage[]>([]);

export function useFeaturedStories() {
    return useContext(FeaturedStoriesContext);
}

export function FeaturedStoriesContextProvider({
    children,
    value,
}: PropsWithChildren<{ value: StoryWithImage[] }>) {
    return (
        <FeaturedStoriesContext.Provider value={value}>{children}</FeaturedStoriesContext.Provider>
    );
}
