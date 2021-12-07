import type {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk';
import { createContext, FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { useIsMounted } from '@/hooks/useIsMounted';
import { AnalyticsContextProvider } from '@/modules/analytics';
import { DEFAULT_LOCALE, importMessages } from '@/utils/lang';
import { LocaleObject } from '@/utils/localeObject';

interface Context {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    selectedCategory?: Category;
    selectedStory?: Story;
    languages: NewsroomLanguageSettings[];
    locale: LocaleObject;
    hasError?: boolean;
}

interface Props extends Omit<Context, 'locale'> {
    isTrackingEnabled?: boolean;
    localeCode: string;
}

const NewsroomContext = createContext<Context | undefined>(undefined);

export const useNewsroomContext = () => {
    const newsroomContext = useContext(NewsroomContext);
    if (!newsroomContext) {
        throw new Error('No `NewsroomContextProvider` found when calling `useNewsroomContext`');
    }

    return newsroomContext;
};

export const NewsroomContextProvider: FunctionComponent<Props> = ({
    categories,
    newsroom,
    selectedCategory,
    selectedStory,
    companyInformation,
    languages,
    localeCode,
    hasError,
    isTrackingEnabled,
    children,
}) => {
    const [messages, setMessages] = useState<Record<string, string>>();
    const isMounted = useIsMounted();

    const locale = useMemo(() => LocaleObject.fromAnyCode(localeCode), [localeCode]);

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
                hasError,
            }}
        >
            <IntlProvider
                locale={locale.toHyphenCode()}
                defaultLocale={DEFAULT_LOCALE}
                messages={messages}
            >
                <AnalyticsContextProvider
                    isEnabled={isTrackingEnabled}
                    newsroom={newsroom}
                    story={selectedStory}
                >
                    {children}
                </AnalyticsContextProvider>
            </IntlProvider>
        </NewsroomContext.Provider>
    );
};
