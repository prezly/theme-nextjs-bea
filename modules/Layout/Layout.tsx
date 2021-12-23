import type { NextSeoProps } from 'next-seo';
import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { LoadingBar, PageSeo } from '@/components';
import { AlternateLanguageLink } from '@/components/seo/types';
import { useNewsroomContext } from '@/contexts/newsroom';
import {
    useCompanyInformation,
    useCurrentLocale,
    useGetLinkLocaleSlug,
    useGetTranslationUrl,
    useLanguages,
    useNewsroom,
    useSelectedStory,
} from '@/hooks';
import { Analytics } from '@/modules/analytics';
import { getAbsoluteUrl, stripHtmlTags } from '@/utils';
import { LocaleObject } from '@/utils/localeObject';
import { getNewsroomLogoUrl } from '@/utils/prezly';
import { getUsedLanguages } from '@/utils/prezly/api/languages';

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
}

const CookieConsentBar = dynamic(() => import('@/modules/analytics/components/CookieConsentBar'), {
    ssr: false,
});

const Layout: FunctionComponent<Props> = ({ children, description, imageUrl, title }) => {
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const companyInformation = useCompanyInformation();
    const newsroom = useNewsroom();
    const { contacts, themePreset } = useNewsroomContext();
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    const selectedStory = useSelectedStory();
    const { asPath } = useRouter();

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
                    hrefLang: locale.toHyphenCode(),
                    href: getAbsoluteUrl(
                        translationLink,
                        newsroom.url,
                        selectedStory && translationLink !== '/'
                            ? false
                            : getLinkLocaleSlug(locale),
                    ),
                };
            })
            .filter<AlternateLanguageLink>(Boolean as any);
    }, [
        currentLocale,
        getLinkLocaleSlug,
        getTranslationUrl,
        languages,
        newsroom.url,
        selectedStory,
    ]);

    useEffect(() => {
        const onRouteChangeStart = () => {
            setIsLoadingPage(true);
        };
        const routeChangeComplete = () => {
            setIsLoadingPage(false);
        };

        Router.events.on('routeChangeStart', onRouteChangeStart);
        Router.events.on('routeChangeComplete', routeChangeComplete);
        return () => {
            Router.events.off('routeChangeStart', onRouteChangeStart);
            Router.events.off('routeChangeComplete', routeChangeComplete);
        };
    }, []);

    return (
        <>
            <Analytics />
            <Branding newsroom={newsroom} themePreset={themePreset} />
            <PageSeo
                title={title || companyInformation.name}
                description={description || stripHtmlTags(companyInformation.about)}
                url={getAbsoluteUrl(asPath, newsroom.url, getLinkLocaleSlug(currentLocale))}
                imageUrl={imageUrl || getNewsroomLogoUrl(newsroom)}
                siteName={companyInformation.name}
                alternateLanguageLinks={alternateLanguageLinks}
                locale={currentLocale}
            />
            <CookieConsentBar />
            <div className={styles.layout}>
                <Header />
                <main className={styles.content}>
                    {children}
                    <LoadingBar isLoading={isLoadingPage} />
                </main>
                {contacts && <Contacts contacts={contacts} />}
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
        </>
    );
};
export default Layout;
