'use client';

import type { Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { translations } from '@prezly/theme-kit-intl';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useDevice } from '@/hooks';
import { IconClose, IconMenu, IconSearch } from '@/icons';
import { FormattedMessage, IntlLink, useIntl } from '@/theme-kit/intl/client';
import type { DisplayedCategory } from '@/ui';
import { Button, ButtonLink } from '@/ui';

import styles from './Header.module.scss';

const SearchWidget = dynamic(() => import('./SearchWidget'), { ssr: false });

interface Props {
    localeCode: Locale.Code;
    newsroom: Newsroom;
    information: NewsroomCompanyInformation;
    categories: DisplayedCategory[];
    children?: ReactNode;
    // hasError?: boolean;
}

export function Header({
    localeCode,
    newsroom,
    information,
    categories,
    children /* hasError */,
}: Props) {
    /*
    const displayedLanguages = useDisplayedLanguages();
    const { name } = useCompanyInformation();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    */
    const { formatMessage } = useIntl();
    /*
    const { ALGOLIA_API_KEY } = useAlgoliaSettings();
    */
    const { isMobile } = useDevice();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchWidgetShown, setIsSearchWidgetShown] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    const IS_SEARCH_ENABLED = false; // FIXME
    /*
    const IS_SEARCH_ENABLED = Boolean(ALGOLIA_API_KEY);
    */

    const shouldShowMenu = false; // FIXME
    /*
    const shouldShowMenu =
        categories.length > 0 || displayedLanguages.length > 0 || public_galleries_number > 0;
    */

    function alignMobileHeader() {
        if (!isMobile) {
            return;
        }

        const header = headerRef.current;
        const headerRect = header?.getBoundingClientRect();

        // If header is not on top of the screen (e.g. a cookie banner is shown or user has scrolled down a bit),
        // Align the header with the top of the screen
        if (headerRect && headerRect.top !== 0) {
            window.scrollBy({ top: headerRect.top });
        }
    }

    function toggleMenu() {
        alignMobileHeader();

        // Adding a timeout to update the state only after the scrolling is triggered.
        setTimeout(() => setIsMenuOpen((o) => !o));
    }
    function closeMenu() {
        return setIsMenuOpen(false);
    }

    function toggleSearchWidget(event: MouseEvent) {
        event.preventDefault();
        alignMobileHeader();

        // Adding a timeout to update the state only after the scrolling is triggered.
        setTimeout(() => setIsSearchWidgetShown((o) => !o));
    }
    function closeSearchWidget() {
        return setIsSearchWidgetShown(false);
    }

    // Add scroll lock to the body while mobile menu is open
    useEffect(() => {
        document.body.classList.toggle(styles.body, isMenuOpen);

        return () => {
            document.body.classList.remove(styles.body);
        };
    }, [isMenuOpen]);

    const newsroomName = information.name || newsroom.display_name;

    return (
        <header /* ref={headerRef} */ className={styles.container}>
            <div className="container">
                <nav role="navigation" className={styles.header}>
                    <IntlLink
                        href="/"
                        className={classNames(styles.newsroom, {
                            [styles.withoutLogo]: !newsroom.newsroom_logo,
                        })}
                    >
                        <h1
                            className={classNames(styles.title, {
                                [styles.hidden]: newsroom.newsroom_logo,
                            })}
                        >
                            {newsroomName}
                        </h1>
                        {newsroom.newsroom_logo && (
                            <Image
                                layout="fill"
                                objectFit="contain"
                                imageDetails={newsroom.newsroom_logo}
                                alt={newsroomName}
                                className={styles.logo}
                            />
                        )}
                    </IntlLink>

                    <div className={styles.navigationWrapper}>
                        {IS_SEARCH_ENABLED && (
                            <ButtonLink
                                href={{
                                    routeName: 'search',
                                    params: { localeCode },
                                }}
                                variation="navigation"
                                className={classNames(styles.searchToggle, {
                                    [styles.hidden]: isMenuOpen,
                                    [styles.close]: isSearchWidgetShown,
                                })}
                                icon={isSearchWidgetShown && isMobile ? IconClose : IconSearch}
                                onClick={toggleSearchWidget}
                                aria-expanded={isSearchWidgetShown}
                                aria-controls="search-widget"
                                title={formatMessage(translations.search.title)}
                                aria-label={formatMessage(translations.search.title)}
                            />
                        )}

                        {shouldShowMenu && (
                            <Button
                                variation="navigation"
                                icon={isMenuOpen ? IconClose : IconMenu}
                                className={classNames(styles.navigationToggle, {
                                    [styles.hidden]: isSearchWidgetShown,
                                })}
                                onClick={toggleMenu}
                                aria-expanded={isMenuOpen}
                                aria-controls="menu"
                                title={formatMessage(translations.misc.toggleMobileNavigation)}
                                aria-label={formatMessage(translations.misc.toggleMobileNavigation)}
                            />
                        )}

                        <div
                            className={classNames(styles.navigation, { [styles.open]: isMenuOpen })}
                        >
                            <div role="none" className={styles.backdrop} onClick={closeMenu} />
                            <ul id="menu" className={styles.navigationInner}>
                                {newsroom.public_galleries_number > 0 && (
                                    <li className={styles.navigationItem}>
                                        <ButtonLink
                                            href={{ routeName: 'media' }}
                                            variation="navigation"
                                            className={styles.navigationButton}
                                        >
                                            <FormattedMessage
                                                for={translations.mediaGallery.title}
                                            />
                                        </ButtonLink>
                                    </li>
                                )}
                                {children}
                            </ul>
                        </div>
                        {IS_SEARCH_ENABLED && (
                            <SearchWidget
                                localeCode={localeCode}
                                categories={categories}
                                dialogClassName={styles.mobileSearchWrapper}
                                isOpen={isSearchWidgetShown}
                                onClose={closeSearchWidget}
                            />
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
