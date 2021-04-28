import { NextSeo } from 'next-seo';
import { FunctionComponent } from 'react';

type Props = {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
};

const PageSeo: FunctionComponent<Props> = ({
    title, description, url, imageUrl,
}) => (
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
            site_name: title,
        }}
    />
);

export default PageSeo;
