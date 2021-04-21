import { Category, Newsroom, NewsroomCompanyInformation } from '@prezly/sdk/dist/types';
import { createContext, FunctionComponent, useContext } from 'react';

interface Context {
    newsroom: Newsroom | null;
    companyInformation: NewsroomCompanyInformation | null;
    categories: Category[];
    selectedCategory?: Category;
}

const NewsroomContext = createContext<Context>({
    newsroom: null,
    categories: [],
    companyInformation: null,
});

export const useNewsroomContext = () => useContext(NewsroomContext);

export const NewsroomContextProvider: FunctionComponent<Context> = ({
    categories,
    newsroom,
    selectedCategory,
    companyInformation,
    children,
}) => (
    <NewsroomContext.Provider
        value={{
            categories, newsroom, selectedCategory, companyInformation,
        }}
    >
        {children}
    </NewsroomContext.Provider>
);
