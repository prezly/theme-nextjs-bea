import classNames from 'classnames';
import { Router } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';

import LoadingIndicator from '../LoadingIndicator';

import Boilerplate from './Boilerplate';
import Footer from './Footer';
import Header from './Header';

import styles from './Layout.module.scss';

const Layout: FunctionComponent = ({ children }) => {
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    useEffect(() => {
        const onRouteChangeStart = () => {
            setIsLoadingPage(true);
        };

        Router.events.on('routeChangeStart', onRouteChangeStart);
        return () => {
            Router.events.off('routeChangeStart', onRouteChangeStart);
        };
    }, []);

    return (
        <div className={styles.layout}>
            <Header />
            <main
                className={classNames(styles.content, {
                    [styles.loading]: isLoadingPage,
                })}
            >
                {isLoadingPage && <LoadingIndicator />}
                {!isLoadingPage && children}
            </main>
            <Boilerplate />
            <Footer />
        </div>
    );
};
export default Layout;
