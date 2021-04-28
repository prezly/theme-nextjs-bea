import { FunctionComponent } from 'react';
import Link from 'next/link';
import Categories from '@/modules/Categories';
import { useCategories } from '@/hooks/useCategories';

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
