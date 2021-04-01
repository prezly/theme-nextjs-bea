import { Category } from '@prezly/sdk/dist/types';
import { FunctionComponent } from 'react';
import Header from './Header';

type Props = {
    categories?: Array<Category>;
};

const Layout: FunctionComponent<Props> = ({ children, categories }) => (
    <>
        <Header categories={categories} />
        {children}
    </>
);

export default Layout;
