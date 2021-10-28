import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { DEFAULT_LOCALE, getSupportedLocaleCode, importMessages } from '@/utils/lang';

import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '../styles/styles.globals.scss';

function App({ Component, router, pageProps }: AppProps) {
    // TODO: We should pull the default locale from Newsroom settings
    const { locale, defaultLocale } = router;

    const [messages, setMessages] = useState<Record<string, string>>();

    useEffect(() => {
        importMessages(locale).then(setMessages);
    }, [locale]);

    return (
        <IntlProvider
            locale={getSupportedLocaleCode(locale) || DEFAULT_LOCALE}
            defaultLocale={defaultLocale || DEFAULT_LOCALE}
            messages={messages}
        >
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
        </IntlProvider>
    );
}

export default App;
