import {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk';
import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { useIsMounted } from '@/hooks/useIsMounted';
import { AnalyticsContextProvider } from '@/modules/analytics';
import { DEFAULT_LOCALE, importMessages } from '@/utils/lang';
import { toUrlSlug } from '@/utils/locale';

interface Context {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    selectedCategory?: Category;
    selectedStory?: Story;
    languages: NewsroomLanguageSettings[];
    localeCode: string;
    hasError?: boolean;
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
    localeCode,
    hasError,
    children,
}) => {
    const [messages, setMessages] = useState<Record<string, string>>();
    const isMounted = useIsMounted();

    useEffect(() => {
        importMessages(localeCode).then((loadedMessages) => {
            if (isMounted()) {
                setMessages(loadedMessages);
            }
        });
    }, [localeCode, isMounted]);

    const localeSlug = localeCode && toUrlSlug(localeCode);

    return (
        <NewsroomContext.Provider
            value={{
                categories,
                newsroom,
                selectedCategory,
                selectedStory,
                companyInformation,
                languages,
                localeCode,
                hasError,
            }}
        >
            <IntlProvider
                locale={localeSlug || DEFAULT_LOCALE}
                defaultLocale={DEFAULT_LOCALE}
                messages={messages}
            >
                <AnalyticsContextProvider newsroom={newsroom} story={selectedStory}>
                    {children}
                </AnalyticsContextProvider>
            </IntlProvider>
        </NewsroomContext.Provider>
    );
};
