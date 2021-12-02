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
import { DEFAULT_LOCALE, importMessages } from '@/utils/lang';
import { toSlug } from '@/utils/locale';

import { getConsentCookie, setConsentCookie } from './lib';

interface Props {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    selectedCategory?: Category;
    selectedStory?: Story;
    languages: NewsroomLanguageSettings[];
    localeCode: string;
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
    localeCode,
    children,
}) => {
    const [messages, setMessages] = useState<Record<string, string>>();
    const [consent, setConsent] = useState(getConsentCookie());
    const isMounted = useIsMounted();

    useEffect(() => {
        importMessages(localeCode).then((loadedMessages) => {
            if (isMounted()) {
                setMessages(loadedMessages);
            }
        });
    }, [localeCode, isMounted]);

    useEffect(() => {
        if (typeof consent === 'boolean') {
            setConsentCookie(consent);
        }
    }, [consent]);

    const localeSlug = localeCode && toSlug(localeCode);

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
                consent,
                setConsent,
            }}
        >
            <IntlProvider
                locale={localeSlug || DEFAULT_LOCALE}
                defaultLocale={DEFAULT_LOCALE}
                messages={messages}
            >
                {children}
            </IntlProvider>
        </NewsroomContext.Provider>
    );
};
