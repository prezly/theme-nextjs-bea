import { ExtendedStory } from '@prezly/sdk/dist/types';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import { FunctionComponent } from 'react';

type Props = {
    story: ExtendedStory;
};

const StorySeo: FunctionComponent<Props> = ({ story }) => {
    const {
        title, subtitle, published_at, updated_at, author, oembed, newsroom,
    } = story;

    const authorName = author?.display_name || author?.username || 'Unknown';

    return (
        <>
            <NextSeo
                openGraph={{
                    title,
                    description: subtitle,
                    url: oembed.url,
                    type: 'article',
                    article: {
                        publishedTime: published_at as string,
                        modifiedTime: updated_at,
                        authors: [authorName],
                    },
                    images: [
                        {
                            url: oembed.thumbnail_url as string,
                            alt: oembed.title,
                            width: parseInt(oembed.thumbnail_width as string),
                            height: parseInt(oembed.thumbnail_height as string),
                        },
                    ],
                }}
            />
            <ArticleJsonLd
                url={oembed.url}
                title={title}
                images={[oembed.thumbnail_url as string]}
                datePublished={published_at as string}
                dateModified={updated_at}
                authorName={[authorName]}
                publisherName={newsroom.display_name}
                publisherLogo={newsroom.thumbnail_url}
                description={subtitle}
            />
        </>
    );
};

export default StorySeo;
