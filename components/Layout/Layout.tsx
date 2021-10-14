import { FunctionComponent } from 'react';

import Boilerplate from './Boilerplate';
import Footer from './Footer';
import Header from './Header';

const Layout: FunctionComponent = ({ children }) => (
    <>
        <Header />
        <div className="container">{children}</div>
        <Boilerplate />
        <Footer />
    </>
);

export default Layout;
