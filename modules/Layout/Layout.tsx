import { Analytics, useAnalyticsContext } from '@prezly/analytics-nextjs';
import {
    getUsedLanguages,
    LocaleObject,
    PageSeo,
    useCurrentLocale,
    useCurrentStory,
    useGetLinkLocaleSlug,
    useGetTranslationUrl,
    useLanguages,
    useNewsroom,
    useNewsroomContext,
} from '@prezly/theme-kit-nextjs';
import type { AlternateLanguageLink } from '@prezly/theme-kit-nextjs/build/components-nextjs/PageSeo';
import { LoadingBar, NotificationsBar, ScrollToTopButton } from '@prezly/themes-ui-components';
import dynamic from 'next/dynamic';
import { Router } from 'next/router';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';

import Boilerplate from './Boilerplate';
import Branding from './Branding';
import Contacts from './Contacts';
import Footer from './Footer';
import Header from './Header';
import SubscribeForm from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    description?: string;
    imageUrl?: string;
    title?: string;
    hasError?: boolean;
}

const CookieConsentBar = dynamic(() => import('./CookieConsentBar'), {
    ssr: false,
});

export function getAbsoluteUrl(path: string, origin: string, localeCode?: string | false): string {
    const url = new URL(`${localeCode ? `/${localeCode}` : ''}${path || '/'}`, origin);
    url.search = '';

    return url.toString();
}

function Layout({ children, description, imageUrl, title, hasError }: PropsWithChildren<Props>) {
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const site = useNewsroom();
    const { contacts, notifications } = useNewsroomContext();
    const { isEnabled: isAnalyticsEnabled } = useAnalyticsContext();
    const currentLocale = useCurrentLocale();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    const getTranslationUrl = useGetTranslationUrl();
    const languages = useLanguages();
    const currentStory = useCurrentStory();

    useEffect(() => {
        function onRouteChangeStart() {
            setIsLoadingPage(true);
        }

        function routeChangeComplete() {
            setIsLoadingPage(false);
        }

        Router.events.on('routeChangeStart', onRouteChangeStart);
        Router.events.on('routeChangeComplete', routeChangeComplete);
        return () => {
            Router.events.off('routeChangeStart', onRouteChangeStart);
            Router.events.off('routeChangeComplete', routeChangeComplete);
        };
    }, []);

    const alternateLanguageLinks: AlternateLanguageLink[] = useMemo(() => {
        if (!languages.length) {
            return [];
        }

        const alternateLanguages = getUsedLanguages(languages).filter(
            (language) => language.code !== currentLocale.toUnderscoreCode(),
        );

        return alternateLanguages
            .map((language) => {
                const locale = LocaleObject.fromAnyCode(language.code);

                const translationLink = getTranslationUrl(locale, true);

                if (!translationLink) {
                    return undefined;
                }

                return {
                    hrefLang: locale.toNeutralLanguageCode(),
                    href: getAbsoluteUrl(
                        translationLink,
                        site.url,
                        currentStory && translationLink !== '/' ? false : getLinkLocaleSlug(locale),
                    ),
                };
            })
            .filter<AlternateLanguageLink>(Boolean as any);
    }, [currentLocale, getLinkLocaleSlug, getTranslationUrl, languages, site.url, currentStory]);

    return (
        <>
            <Analytics />
            <Branding newsroom={site} />
            <PageSeo
                title={title}
                description={description}
                imageUrl={imageUrl}
                noindex={!isAnalyticsEnabled}
                nofollow={!isAnalyticsEnabled}
                languageAlternates={alternateLanguageLinks}
            />
            <NotificationsBar notifications={notifications} />
            <CookieConsentBar />
            <div className={styles.layout}>
                <Header hasError={hasError} />
                <main className={styles.content}>
                    {children}
                    <LoadingBar isLoading={isLoadingPage} />
                </main>
                {contacts && <Contacts contacts={contacts} />}
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
            <ScrollToTopButton />
        </>
    );
}

export default Layout;
