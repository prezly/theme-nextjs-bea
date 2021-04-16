import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { createContext, FunctionComponent, useContext } from 'react';

interface Context {
    newsroom: Newsroom | null;
    categories: Category[];
    selectedCategory?: Category;
}

const NewsroomContext = createContext<Context>({
    newsroom: null,
    categories: [],
});

export const useNewsroomContext = () => useContext(NewsroomContext);

export const NewsroomContextProvider: FunctionComponent<Context> = ({
    categories,
    newsroom,
    selectedCategory,
    children,
}) => (
    <NewsroomContext.Provider value={{ categories, newsroom, selectedCategory }}>
        {children}
    </NewsroomContext.Provider>
);
