import { FunctionComponent } from 'react';
import { Footer } from './Footer';
import Header from './Header';

const Layout: FunctionComponent = ({ children }) => (
    <div className="container">
        <Header />
        {children}
        <Footer />
    </div>
);

export default Layout;
