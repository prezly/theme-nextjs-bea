import { FunctionComponent } from 'react';
import Link from 'next/link';
import Categories from '@/modules/Categories';
import { Category } from '@prezly/sdk/dist/types';

type Props = {
    categories?: Array<Category>
};

const Header: FunctionComponent<Props> = ({ categories }) => (
    <header>
        <Link href="/" passHref>
            <a>Home</a>
        </Link>
        {
            categories && <Categories categories={categories} />
        }
    </header>
);

export default Header;
