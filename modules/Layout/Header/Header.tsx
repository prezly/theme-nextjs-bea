import translations from '@prezly/themes-intl-messages';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, CategoriesDropdown, LanguagesDropdown } from '@/components';
import { useCategories, useCompanyInformation, useNewsroom } from '@/hooks';
import { IconClose, IconMenu } from '@/icons';

import styles from './Header.module.scss';

const Header: FunctionComponent = () => {
    const { newsroom_logo, display_name, public_galleries_number } = useNewsroom();
    const categories = useCategories();
    const { name } = useCompanyInformation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((o) => !o);
    const closeMenu = () => setIsMenuOpen(false);

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

                    <Button
                        variation="navigation"
                        icon={isMenuOpen ? IconClose : IconMenu}
                        title="Toggle navigation"
                        aria-label="Toggle navigation"
                        className={styles.navigationToggle}
                        onClick={toggleMenu}
                    />

                    <div className={classNames(styles.navigation, { [styles.open]: isMenuOpen })}>
                        <div role="none" className={styles.backdrop} onClick={closeMenu} />
                        <div className={styles.navigationInner}>
                            {public_galleries_number > 0 && (
                                <Button.Link
                                    href="/media"
                                    variation="navigation"
                                    className={styles.navigationButton}
                                >
                                    <FormattedMessage {...translations.mediaGallery.title} />
                                </Button.Link>
                            )}
                            <CategoriesDropdown
                                categories={categories}
                                buttonClassName={styles.navigationButton}
                            />
                            <LanguagesDropdown buttonClassName={styles.navigationButton} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
