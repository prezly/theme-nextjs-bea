import { AnalyticsContextProvider } from '@prezly/analytics-nextjs';
import type { PageProps } from '@prezly/theme-kit-nextjs';
import { DEFAULT_LOCALE, LocaleObject, NewsroomContextProvider } from '@prezly/theme-kit-nextjs';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';

import type { BasePageProps } from 'types';

import '@prezly/content-renderer-react-js/styles.css';
import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '@prezly/themes-ui-components/styles.css';
import '../styles/styles.globals.scss';

function App({ Component, pageProps }: AppProps) {
    const { newsroomContextProps, translations, isTrackingEnabled, ...customPageProps } =
        pageProps as PageProps & BasePageProps;

    const { localeCode, newsroom, currentStory } = newsroomContextProps || {
        localeCode: DEFAULT_LOCALE,
    };
    const locale = useMemo(() => LocaleObject.fromAnyCode(localeCode), [localeCode]);

    // `newsroomContextProps` can be undefined, if there was error when fetching the newsroom props.
    // This can happen due to connection issues, or incorrect credentials in your .env file.
    // In this case, a 500 error page would be rendered, which shouldn't rely on the Newsroom Context (especially when statically generated).
    if (!newsroomContextProps) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <Component {...customPageProps} />;
    }

    /* eslint-disable react/jsx-props-no-spreading */
    return (
        <NewsroomContextProvider {...newsroomContextProps}>
            <IntlProvider
                locale={locale.toHyphenCode()}
                defaultLocale={DEFAULT_LOCALE}
                messages={translations}
            >
                <AnalyticsContextProvider
                    isEnabled={isTrackingEnabled}
                    newsroom={newsroom}
                    story={currentStory}
                >
                    <Component {...customPageProps} />
                </AnalyticsContextProvider>
            </IntlProvider>
        </NewsroomContextProvider>
    );
    /* eslint-enable react/jsx-props-no-spreading */
}

export default App;
