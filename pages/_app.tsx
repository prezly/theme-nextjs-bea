import { AppProps } from 'next/app';

import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '../styles/styles.globals.scss';

function App({ Component, pageProps }: AppProps) {
    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Component {...pageProps} />
    );
}

export default App;
