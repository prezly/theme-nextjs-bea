import translations from '@prezly/themes-intl-messages';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent, useEffect, useState } from 'react';
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

    useEffect(() => {
        document.body.classList.toggle(styles.body, isMenuOpen);

        return () => {
            document.body.classList.remove(styles.body);
        };
    }, [isMenuOpen]);

    const newsroomName = name || display_name;

    return (
        <header className={styles.container}>
            <div className="container">
                <nav role="navigation" className={styles.header}>
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
                        className={styles.navigationToggle}
                        onClick={toggleMenu}
                        iconOnly
                        aria-expanded={isMenuOpen}
                        aria-controls="menu"
                    >
                        {/* TODO: add to intl-messages */}
                        Toggle navigation
                    </Button>

                    <div className={classNames(styles.navigation, { [styles.open]: isMenuOpen })}>
                        <div role="none" className={styles.backdrop} onClick={closeMenu} />
                        <ul id="menu" className={styles.navigationInner}>
                            {public_galleries_number > 0 && (
                                <li className={styles.navigationItem}>
                                    <Button.Link
                                        href="/media"
                                        variation="navigation"
                                        className={styles.navigationButton}
                                    >
                                        <FormattedMessage {...translations.mediaGallery.title} />
                                    </Button.Link>
                                </li>
                            )}
                            <CategoriesDropdown
                                categories={categories}
                                buttonClassName={styles.navigationButton}
                                navigationItemClassName={styles.navigationItem}
                            />
                            <LanguagesDropdown
                                buttonClassName={classNames(
                                    styles.navigationButton,
                                    styles.languagesButton,
                                )}
                                navigationItemClassName={styles.navigationItem}
                            />
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
