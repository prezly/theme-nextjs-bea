import {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk/dist/types';
import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { DEFAULT_LOCALE, importMessages } from '@/utils/lang';
import { convertToBrowserFormat } from '@/utils/localeTransform';

interface Context {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    selectedCategory?: Category;
    selectedStory?: Story;
    newsroomLanguages: NewsroomLanguageSettings[];
    locale: string;
}

const NewsroomContext = createContext<Context | undefined>(undefined);

export const useNewsroomContext = () => {
    const newsroomContext = useContext(NewsroomContext);
    if (!newsroomContext) {
        throw new Error('No `NewsroomContextProvider` found when calling `useNewsroomContext`');
    }

    return newsroomContext as Context;
};

export const NewsroomContextProvider: FunctionComponent<Context> = ({
    categories,
    newsroom,
    selectedCategory,
    selectedStory,
    companyInformation,
    newsroomLanguages,
    locale,
    children,
}) => {
    const [messages, setMessages] = useState<Record<string, string>>();

    useEffect(() => {
        importMessages(locale).then(setMessages);
    }, [locale]);

    return (
        <NewsroomContext.Provider
            value={{
                categories,
                newsroom,
                selectedCategory,
                selectedStory,
                companyInformation,
                newsroomLanguages,
                locale,
            }}
        >
            <IntlProvider
                locale={convertToBrowserFormat(locale) || DEFAULT_LOCALE}
                defaultLocale={DEFAULT_LOCALE}
                messages={messages}
            >
                {children}
            </IntlProvider>
        </NewsroomContext.Provider>
    );
};
