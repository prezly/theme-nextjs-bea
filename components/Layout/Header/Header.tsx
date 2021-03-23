import type { FunctionComponent } from 'react';
import Link from 'next/link';

const Header: FunctionComponent = () => (
    <header>
        <Link href="/" passHref>
            <a>Home</a>
        </Link>
    </header>
);

export default Header;
