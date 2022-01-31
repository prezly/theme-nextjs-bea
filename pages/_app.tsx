import {
    BasePageProps,
    DEFAULT_LOCALE,
    LocaleObject,
    NewsroomContextProvider,
} from '@prezly/theme-kit-nextjs';
import { AppProps } from 'next/app';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';

import { AnalyticsContextProvider } from '@/modules/analytics';

import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '../styles/styles.globals.scss';

function App({ Component, pageProps }: AppProps) {
    const {
        categories,
        contacts,
        newsroom,
        companyInformation,
        languages,
        localeCode,
        themePreset,
        algoliaSettings,
        translations,
        isTrackingEnabled,
        selectedCategory,
        selectedStory,
        shortestLocaleCode,
        localeResolved,
        hasError,
        ...customPageProps
    } = pageProps as BasePageProps & Record<string, any>;

    const locale = useMemo(() => LocaleObject.fromAnyCode(localeCode), [localeCode]);

    return (
        <NewsroomContextProvider
            categories={categories}
            contacts={contacts}
            newsroom={newsroom}
            companyInformation={companyInformation}
            languages={languages}
            localeCode={localeCode}
            themePreset={themePreset}
            selectedCategory={selectedCategory}
            selectedStory={selectedStory}
            algoliaSettings={algoliaSettings}
            hasError={hasError}
        >
            <IntlProvider
                locale={locale.toHyphenCode()}
                defaultLocale={DEFAULT_LOCALE}
                messages={translations}
            >
                <AnalyticsContextProvider
                    isEnabled={isTrackingEnabled}
                    newsroom={newsroom}
                    story={selectedStory}
                >
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <Component {...customPageProps} />
                </AnalyticsContextProvider>
            </IntlProvider>
        </NewsroomContextProvider>
    );
}

export default App;
