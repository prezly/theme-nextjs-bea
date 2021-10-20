import Image from '@prezly/uploadcare-image';
import Link from 'next/link';
import { FunctionComponent } from 'react';

import { useCategories } from '@/hooks/useCategories';
import { useNewsroom } from '@/hooks/useNewsroom';

import CategoriesDropdown from '../../CategoriesDropdown';

import styles from './Header.module.scss';

const Header: FunctionComponent = () => {
    const newsroom = useNewsroom();
    const categories = useCategories();
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
                    <CategoriesDropdown categories={categories} />
                </div>
            </div>
        </header>
    );
};

export default Header;
