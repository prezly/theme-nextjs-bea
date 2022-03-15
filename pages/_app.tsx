import type { PageProps } from '@prezly/theme-kit-nextjs';
import { DEFAULT_LOCALE, LocaleObject, NewsroomContextProvider } from '@prezly/theme-kit-nextjs';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';

import { AnalyticsContextProvider } from '@/modules/analytics';
import type { BasePageProps } from 'types';

import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '../styles/styles.globals.scss';

function App({ Component, pageProps }: AppProps) {
    const { newsroomContextProps, translations, isTrackingEnabled, ...customPageProps } =
        pageProps as PageProps & BasePageProps;

    const { localeCode, newsroom, currentStory } = newsroomContextProps;
    const locale = useMemo(() => LocaleObject.fromAnyCode(localeCode), [localeCode]);

    /* eslint-disable react/jsx-props-no-spreading */
    return (
        <NewsroomContextProvider {...newsroomContextProps}>
            <IntlProvider
                locale={locale.toHyphenCode()}
                defaultLocale={DEFAULT_LOCALE}
                messages={translations}
            >
                <AnalyticsContextProvider
                    isEnabled={isTrackingEnabled ?? process.env.NEXT_PUBLIC_IS_TRACKING_ENABLED}
                    newsroom={newsroom}
                    story={currentStory}
                >
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <Component {...customPageProps} />
                </AnalyticsContextProvider>
            </IntlProvider>
        </NewsroomContextProvider>
    );
    /* eslint-enable react/jsx-props-no-spreading */
}

export default App;
