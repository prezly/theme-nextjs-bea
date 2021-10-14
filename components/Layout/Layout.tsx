import { FunctionComponent } from 'react';

import { Footer } from './Footer';
import Header from './Header';

const Layout: FunctionComponent = ({ children }) => (
    <>
        <Header />
        <div className="container">
            {children}
            <Footer />
        </div>
    </>
);

export default Layout;
