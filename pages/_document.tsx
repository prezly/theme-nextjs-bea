import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

import { getLocaleDirection } from '@/utils/locale';
import { LocaleObject } from '@/utils/localeObject';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        // eslint-disable-next-line no-underscore-dangle
        const { localeCode } = this.props.__NEXT_DATA__.props.pageProps;

        const locale = LocaleObject.fromAnyCode(localeCode);
        const direction = getLocaleDirection(locale);

        return (
            <Html lang={locale.toHyphenCode()} dir={direction}>
                <Head>
                    <meta name="og:locale" content={locale.toHyphenCode()} />
                    {/* TODO: Add alternate locales */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
