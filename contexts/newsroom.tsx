import {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk/dist/types';
import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import useIsMounted from '@/hooks/useIsMounted';
import { DEFAULT_LOCALE, importMessages } from '@/utils/lang';
import { convertToBrowserFormat } from '@/utils/localeTransform';

interface Context {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    selectedCategory?: Category;
    selectedStory?: Story;
    languages: NewsroomLanguageSettings[];
    locale: string;
}

const NewsroomContext = createContext<Context | undefined>(undefined);

export const useNewsroomContext = () => {
    const newsroomContext = useContext(NewsroomContext);
    if (!newsroomContext) {
        throw new Error('No `NewsroomContextProvider` found when calling `useNewsroomContext`');
    }

    return newsroomContext;
};

export const NewsroomContextProvider: FunctionComponent<Context> = ({
    categories,
    newsroom,
    selectedCategory,
    selectedStory,
    companyInformation,
    languages,
    locale,
    children,
}) => {
    const [messages, setMessages] = useState<Record<string, string>>();
    const isMounted = useIsMounted();

    useEffect(() => {
        importMessages(locale).then((loadedMessages) => {
            if (isMounted()) {
                setMessages(loadedMessages);
            }
        });
    }, [locale, isMounted]);

    return (
        <NewsroomContext.Provider
            value={{
                categories,
                newsroom,
                selectedCategory,
                selectedStory,
                companyInformation,
                languages,
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
