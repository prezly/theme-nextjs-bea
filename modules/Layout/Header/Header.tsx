import { mediaGalleryTitle } from '@prezly/themes-intl-messages';
import Image from '@prezly/uploadcare-image';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, CategoriesDropdown, LanguagesDropdown } from '@/components';
import { useCategories, useCompanyInformation, useNewsroom } from '@/hooks';

import styles from './Header.module.scss';

const Header: FunctionComponent = () => {
    const { newsroom_logo, display_name, public_galleries_number } = useNewsroom();
    const categories = useCategories();
    const { name } = useCompanyInformation();

    const newsroomName = name || display_name;

    return (
        <header className={styles.container}>
            <div className="container">
                <div className={styles.header}>
                    <Link href="/" passHref>
                        <a className={styles.newsroom}>
                            {newsroom_logo ? (
                                <Image
                                    layout="fill"
                                    objectFit="contain"
                                    imageDetails={newsroom_logo}
                                    alt={newsroomName}
                                    className={styles.logo}
                                />
                            ) : (
                                newsroomName
                            )}
                        </a>
                    </Link>

                    <div className={styles.navigation}>
                        {public_galleries_number > 0 && (
                            <Button.Link href="/media" variation="navigation">
                                <FormattedMessage {...mediaGalleryTitle} />
                            </Button.Link>
                        )}
                        <CategoriesDropdown categories={categories} />
                        <LanguagesDropdown />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
