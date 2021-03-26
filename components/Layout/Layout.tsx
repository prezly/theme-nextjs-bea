import { FunctionComponent } from 'react';
import Header from './Header';

const Layout: FunctionComponent = ({ children }) => (
    <>
        <Header />
        {children}
    </>
);

export default Layout;
