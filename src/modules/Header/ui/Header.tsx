'use client';

import type {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    TranslatedCategory,
} from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import type { UploadedImage } from '@prezly/uploadcare';
import { useMeasure } from '@react-hookz/web';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { FormattedMessage, useIntl } from '@/adapters/client';
import { Button, ButtonLink } from '@/components/Button';
import { CategoriesBar } from '@/components/CategoriesBar';
import { Link } from '@/components/Link';
import { useDevice, usePreviewSettings } from '@/hooks';
import { IconClose, IconExternalLink, IconMenu, IconSearch } from '@/icons';
import { useBroadcastedPageTypeCheck } from '@/modules/Broadcast';
import type { ThemeSettings } from '@/theme-settings';
import type { SearchSettings } from '@/types';
import { isPreviewActive } from '@/utils';

import { Categories } from './Categories';
import { Logo, LogoPlaceholder } from './Logo';

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
    categories: Category[];
    translatedCategories: TranslatedCategory[];
    searchSettings?: SearchSettings;
    children?: ReactNode;
    displayedGalleries: number;
    displayedLanguages: number;
    categoriesLayout: ThemeSettings['categories_layout'];
    logoSize: ThemeSettings['logo_size'];
    mainSiteUrl: string | null;
    mainSiteLabel: string | null;
    newsrooms: Newsroom[];
}

export function Header({
    localeCode,
    newsroom,
    information,
    categories,
    translatedCategories,
    searchSettings,
    displayedGalleries,
    displayedLanguages,
    children,
    newsrooms,
    ...props
}: Props) {
    const { formatMessage } = useIntl();
    const { isMobile } = useDevice();
    const searchParams = useSearchParams();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [measurement, headerRef] = useMeasure<HTMLElement>();
    const isSearchPage = useBroadcastedPageTypeCheck('search');
    const isPreviewMode = process.env.PREZLY_MODE === 'preview';
    const isPreview = isPreviewActive();

    const previewSettings = usePreviewSettings();

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

    const logo = useMemo(() => {
        if (isPreviewMode && previewSettings) {
            const raw = previewSettings.main_logo;
            if (raw) {
                try {
                    return JSON.parse(raw) as UploadedImage;
                } catch {
                    return null;
                }
            }
            return null;
        }

        const urlPreview = isPreviewMode && searchParams.get('main_logo');
        if (urlPreview) {
            try {
                return JSON.parse(urlPreview) as UploadedImage;
            } catch {
                return null;
            }
        }

        return newsroom.newsroom_logo;
    }, [isPreviewMode, previewSettings, newsroom.newsroom_logo, searchParams]);

    const logoSize = useMemo(() => {
        if (isPreviewMode && previewSettings) {
            return previewSettings.logo_size || props.logoSize;
        }
        const urlPreview = isPreviewMode && searchParams.get('logo_size');
        return urlPreview || props.logoSize;
    }, [isPreviewMode, previewSettings, props.logoSize, searchParams]);

    const mainSiteUrl = useMemo(() => {
        if (isPreviewMode && previewSettings) {
            return validateUrl(previewSettings.main_site_url || null);
        }
        const urlPreview = isPreviewMode && validateUrl(searchParams.get('main_site_url'));
        if (urlPreview) return urlPreview;
        return props.mainSiteUrl ? validateUrl(props.mainSiteUrl) : null;
    }, [isPreviewMode, previewSettings, props.mainSiteUrl, searchParams]);

    function getMainSiteLabel() {
        if (isPreviewMode && previewSettings) {
            return previewSettings.main_site_label || props.mainSiteLabel;
        }
        const urlPreview = isPreviewMode && searchParams.get('main_site_label');
        return urlPreview || props.mainSiteLabel;
    }

    const categoriesLayout = useMemo(() => {
        if (isPreviewMode && previewSettings) {
            const val = previewSettings.categories_layout;
            if (val === 'dropdown' || val === 'bar') return val;
            return props.categoriesLayout;
        }
        const urlPreview = isPreviewMode && searchParams.get('categories_layout');
        if (urlPreview === 'dropdown' || urlPreview === 'bar') return urlPreview;
        return props.categoriesLayout;
    }, [isPreviewMode, previewSettings, props.categoriesLayout, searchParams]);

    const isCategoriesLayoutBar = categoriesLayout === 'bar';
    const isCategoriesLayoutDropdown = categoriesLayout === 'dropdown' || isMobile;
    const numberOfPublicGalleries = newsroom.public_galleries_number;
    const shouldShowSearchText =
        !isMobile &&
        [
            isPreview || numberOfPublicGalleries > 0,
            mainSiteUrl,
            isCategoriesLayoutDropdown && translatedCategories.length > 0,
        ].filter(Boolean).length < 2;

    return (
        <>
            <header ref={headerRef} className={styles.container}>
                <div className="container">
                    <nav className={styles.header}>
                        {isPreview && !logo ? (
                            <LogoPlaceholder newsroom={newsroom} />
                        ) : (
                            <Link
                                href={{ routeName: 'index', params: { localeCode } }}
                                className={classNames(styles.newsroom, {
                                    [styles.withoutLogo]: !logo,
                                })}
                            >
                                {!logo && <div className={styles.title}>{newsroomName}</div>}
                                {logo && <Logo alt={newsroomName} image={logo} size={logoSize} />}
                            </Link>
                        )}

                        <div className={styles.navigationWrapper}>
                            {searchSettings && !newsroom.is_hub && (
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
                                    title={formatMessage(translations.search.title)}
                                    aria-label={formatMessage(translations.search.title)}
                                >
                                    {shouldShowSearchText
                                        ? formatMessage(translations.search.title)
                                        : undefined}
                                </ButtonLink>
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
                                    aria-label={formatMessage(
                                        translations.misc.toggleMobileNavigation,
                                    )}
                                />
                            )}

                            <div
                                className={classNames(styles.navigation, {
                                    [styles.open]: isMenuOpen,
                                })}
                            >
                                <div role="none" className={styles.backdrop} onClick={closeMenu} />
                                {/** biome-ignore lint/correctness/useUniqueElementIds: <Header is rendered only once. It's safe to have static id> */}
                                <ul id="menu" className={styles.navigationInner}>
                                    {(numberOfPublicGalleries > 0 || isPreview) && (
                                        <li className={styles.navigationItem}>
                                            <ButtonLink
                                                href={{
                                                    routeName: 'media',
                                                    params: { localeCode },
                                                }}
                                                variation="navigation"
                                                className={styles.navigationButton}
                                            >
                                                <FormattedMessage
                                                    locale={localeCode}
                                                    for={
                                                        numberOfPublicGalleries === 1
                                                            ? translations.mediaGallery
                                                                  .titleSingular
                                                            : translations.mediaGallery.title
                                                    }
                                                />
                                            </ButtonLink>
                                        </li>
                                    )}
                                    {isCategoriesLayoutDropdown && (
                                        <Categories
                                            categories={categories}
                                            localeCode={localeCode}
                                            marginTop={measurement?.height}
                                            translatedCategories={translatedCategories}
                                        />
                                    )}
                                    {mainSiteUrl && (
                                        <li className={styles.navigationItem}>
                                            <ButtonLink
                                                href={mainSiteUrl.href}
                                                variation="navigation"
                                                icon={IconExternalLink}
                                                iconPlacement="right"
                                                className={styles.navigationButton}
                                            >
                                                {getMainSiteLabel() || humanizeUrl(mainSiteUrl)}
                                            </ButtonLink>
                                        </li>
                                    )}
                                    {children}
                                </ul>
                            </div>
                            {searchSettings && (
                                <SearchWidget
                                    settings={searchSettings}
                                    localeCode={localeCode}
                                    categories={translatedCategories}
                                    dialogClassName={styles.mobileSearchWrapper}
                                    isOpen={isSearchOpen}
                                    isSearchPage={isSearchPage}
                                    onClose={closeSearchWidget}
                                    newsrooms={newsrooms}
                                    newsroomUuid={newsroom.uuid}
                                />
                            )}
                        </div>
                    </nav>
                </div>
            </header>
            {isCategoriesLayoutBar && <CategoriesBar translatedCategories={translatedCategories} />}
        </>
    );
}

function humanizeUrl(url: URL) {
    const string = url.hostname.replace(/^www\./, '');
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function validateUrl(url: string | null) {
    if (!url) return null;

    try {
        const normalizedUrl =
            url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

        const parsedUrl = new URL(normalizedUrl);

        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return null;
        }

        return parsedUrl;
    } catch {
        return null;
    }
}
