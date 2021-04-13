import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { createContext } from 'react';

interface INewsroomContext {
    newsroom: Newsroom | null;
    categories: Array<Category>;
    selectedCategory?: Category;
}

export const NewsroomContext = createContext<INewsroomContext>({
    newsroom: null,
    categories: []
});
