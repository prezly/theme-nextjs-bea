'use client';

import type { Newsroom, NewsroomCompanyInformation, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { FormattedMessage, useIntl } from '@/adapters/client';
import { Button, ButtonLink } from '@/components/Button';
import { Link } from '@/components/Link';
import { useDevice } from '@/hooks';
import { IconClose, IconMenu, IconSearch } from '@/icons';
import { useBroadcastedPageTypeCheck } from '@/modules/Broadcast';
import type { AlgoliaSettings } from 'types';

import styles from './Header.module.scss';

const SearchWidget = dynamic(
    async () => {
        const component = await import('./SearchWidget');
        return { default: component.SearchWidget };
    },
    { ssr: false },
);

interface Props {
    localeCode: Locale.Code;
    newsroom: Newsroom;
    information: NewsroomCompanyInformation;
    categories: TranslatedCategory[];
    algoliaSettings?: AlgoliaSettings;
    children?: ReactNode;
    displayedGalleries: number;
    displayedLanguages: number;
}

export function Header({
    localeCode,
    newsroom,
    information,
    categories,
    algoliaSettings,
    displayedGalleries,
    displayedLanguages,
    children /* hasError */,
}: Props) {
    const { formatMessage } = useIntl();
    const { isMobile } = useDevice();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const isSearchPage = useBroadcastedPageTypeCheck('search');

    const shouldShowMenu =
        categories.length > 0 || displayedLanguages > 0 || displayedGalleries > 0;

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
        setTimeout(() => setSearchOpen((o) => !o));
    }
    function closeSearchWidget() {
        return setSearchOpen(false);
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
        <header ref={headerRef} className={styles.container}>
            <div className="container">
                <nav role="navigation" className={styles.header}>
                    <Link
                        href={{ routeName: 'index', params: { localeCode } }}
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
                    </Link>

                    <div className={styles.navigationWrapper}>
                        {algoliaSettings && (
                            <ButtonLink
                                href={{
                                    routeName: 'search',
                                    params: { localeCode },
                                }}
                                variation="navigation"
                                className={classNames(styles.searchToggle, {
                                    [styles.hidden]: isMenuOpen,
                                    [styles.close]: isSearchOpen,
                                })}
                                icon={isSearchOpen && isMobile ? IconClose : IconSearch}
                                onClick={toggleSearchWidget}
                                aria-expanded={isSearchOpen}
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
                                    [styles.hidden]: isSearchOpen,
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
                                            href={{ routeName: 'media', params: { localeCode } }}
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
                        {algoliaSettings && (
                            <SearchWidget
                                algoliaSettings={algoliaSettings}
                                localeCode={localeCode}
                                categories={categories}
                                dialogClassName={styles.mobileSearchWrapper}
                                isOpen={isSearchOpen}
                                isSearchPage={isSearchPage}
                                onClose={closeSearchWidget}
                            />
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
