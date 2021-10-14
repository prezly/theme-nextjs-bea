import Image from '@prezly/uploadcare-image';
import Link from 'next/link';
import { FunctionComponent } from 'react';

import { useCategories } from '@/hooks/useCategories';
import { useNewsroom } from '@/hooks/useNewsroom';
import Categories from '@/modules/Categories';

import styles from './Header.module.scss';

const Header: FunctionComponent = () => {
    const newsroom = useNewsroom();
    const categories = useCategories();

    // TODO: Show logo when Image component from `website-nextjs` repo is extracted to a package
    const { display_name, newsroom_logo } = newsroom || {};

    return (
        <header className={styles.container}>
            <div className="container">
                <div className={styles.header}>
                    <Link href="/" passHref>
                        <a>
                            {newsroom_logo ? (
                                <Image
                                    layout="fill"
                                    objectFit="contain"
                                    imageDetails={newsroom_logo}
                                    alt={display_name}
                                    className={styles.logo}
                                />
                            ) : (
                                display_name
                            )}
                        </a>
                    </Link>
                    <Categories categories={categories} />
                </div>
            </div>
        </header>
    );
};

export default Header;
