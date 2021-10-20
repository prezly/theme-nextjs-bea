import { FunctionComponent } from 'react';

import Boilerplate from './Boilerplate';
import Footer from './Footer';
import Header from './Header';
import SubscribeForm from './SubscribeForm';

const Layout: FunctionComponent = ({ children }) => (
    <>
        <Header />
        <div className="container">{children}</div>
        <SubscribeForm />
        <Boilerplate />
        <Footer />
    </>
);

export default Layout;
