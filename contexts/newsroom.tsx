import {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
} from '@prezly/sdk/dist/types';
import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { DEFAULT_LOCALE, importMessages } from '@/utils/lang';
import { convertToBrowserFormat } from '@/utils/localeTransform';

interface Context {
    newsroom: Newsroom | null;
    companyInformation: NewsroomCompanyInformation | null;
    categories: Category[];
    selectedCategory?: Category;
    newsroomLanguages: NewsroomLanguageSettings[];
    locale: string;
}

const NewsroomContext = createContext<Context>({
    newsroom: null,
    categories: [],
    companyInformation: null,
    newsroomLanguages: [],
    locale: DEFAULT_LOCALE,
});

export const useNewsroomContext = () => useContext(NewsroomContext);

export const NewsroomContextProvider: FunctionComponent<Context> = ({
    categories,
    newsroom,
    selectedCategory,
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
