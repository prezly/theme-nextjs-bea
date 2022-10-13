import type { PageProps } from '@prezly/theme-kit-nextjs';
import { DEFAULT_LOCALE, getLocaleDirection, LocaleObject } from '@prezly/theme-kit-nextjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        const {
            newsroomContextProps: { localeCode = DEFAULT_LOCALE },
            // eslint-disable-next-line no-underscore-dangle
        } = this.props.__NEXT_DATA__.props.pageProps as PageProps;

        const locale = LocaleObject.fromAnyCode(localeCode);
        // TODO: The direction can be pulled from the Language object
        const direction = getLocaleDirection(locale);

        return (
            <Html lang={locale.toHyphenCode()} dir={direction} className="h-full antialiased">
                <Head>
                    <meta name="og:locale" content={locale.toHyphenCode()} />
                </Head>
                <body className="flex h-full flex-col bg-zinc-50 dark:bg-black">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
