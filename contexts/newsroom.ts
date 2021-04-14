import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { createContext } from 'react';

interface Context {
    newsroom: Newsroom | null;
    categories: Array<Category>;
    selectedCategory?: Category;
}

export const NewsroomContext = createContext<Context>({
    newsroom: null,
    categories: [],
});
