import { NextSeo } from 'next-seo';
import { FunctionComponent } from 'react';

import { LocaleObject } from '@/utils';
import { AlternateLanguageLink } from 'types';

type Props = {
    title: string;
    description?: string;
    url: string;
    imageUrl: string;
    siteName: string;
    locale: LocaleObject;
    alternateLanguageLinks?: AlternateLanguageLink[];
};

const PageSeo: FunctionComponent<Props> = ({
    title,
    description,
    url,
    imageUrl,
    siteName,
    locale,
    alternateLanguageLinks,
}) => (
    <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
            url,
            title,
            description,
            locale: locale.toUnderscoreCode(),
            images: [
                {
                    url: imageUrl,
                    alt: title,
                },
            ],
            site_name: siteName,
        }}
        twitter={{
            site: siteName,
            cardType: 'summary',
        }}
        additionalMetaTags={[{ name: 'twitter:image', content: imageUrl }]}
        languageAlternates={alternateLanguageLinks}
    />
);

export default PageSeo;
