import Link from 'next/link';
import { FunctionComponent } from 'react';

import { useCategories } from '@/hooks/useCategories';
import Categories from '@/modules/Categories';

const Header: FunctionComponent = () => {
    const categories = useCategories();

    return (
        <header>
            <Link href="/" passHref>
                <a>Home</a>
            </Link>
            {categories && <Categories categories={categories} />}
        </header>
    );
};

export default Header;
