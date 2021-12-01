import {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk';
import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import useIsMounted from '@/hooks/useIsMounted';
import { AnalyticsContextProvider } from '@/modules/analytics';
import { DEFAULT_LOCALE, importMessages } from '@/utils/lang';
import { convertToBrowserFormat } from '@/utils/locale';

import { getConsentCookie, setConsentCookie } from './lib';

interface Props {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    selectedCategory?: Category;
    selectedStory?: Story;
    languages: NewsroomLanguageSettings[];
    locale: string;
}

interface Context extends Props {
    consent: boolean | null;
    setConsent: (consent: boolean) => void;
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
    locale,
    children,
}) => {
    const [messages, setMessages] = useState<Record<string, string>>();
    const [consent, setConsent] = useState(getConsentCookie());
    const isMounted = useIsMounted();

    useEffect(() => {
        importMessages(locale).then((loadedMessages) => {
            if (isMounted()) {
                setMessages(loadedMessages);
            }
        });
    }, [locale, isMounted]);

    useEffect(() => {
        if (typeof consent === 'boolean') {
            setConsentCookie(consent);
        }
    }, [consent]);

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
                consent,
                setConsent,
            }}
        >
            <IntlProvider
                locale={convertToBrowserFormat(locale) || DEFAULT_LOCALE}
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
