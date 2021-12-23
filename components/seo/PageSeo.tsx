import { NextSeo } from 'next-seo';
import { FunctionComponent } from 'react';

type Props = {
    title: string;
    description?: string;
    url: string;
    imageUrl: string;
    siteName: string;
};

const PageSeo: FunctionComponent<Props> = ({ title, description, url, imageUrl, siteName }) => (
    <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
            url,
            title,
            description,
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
    />
);

export default PageSeo;
