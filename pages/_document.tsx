import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

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

        return (
            <Html lang={locale.toHyphenCode()}>
                <Head>
                    <meta name="og:locale" content={locale.toHyphenCode()} />
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
