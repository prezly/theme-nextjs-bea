import type { ExtendedStory } from '@prezly/sdk';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import { FunctionComponent } from 'react';

import { AlternateLanguageLink } from './types';

type Props = {
    story: ExtendedStory;
    alternateLanguageLinks?: AlternateLanguageLink[];
};

const StorySeo: FunctionComponent<Props> = ({ story, alternateLanguageLinks }) => {
    const { title, subtitle, published_at, updated_at, author, oembed, newsroom } = story;

    const authorName = author?.display_name || author?.username || 'Unknown';

    return (
        <>
            <NextSeo
                title={title}
                description={subtitle}
                canonical={oembed.url}
                openGraph={{
                    title,
                    description: subtitle,
                    url: oembed.url,
                    site_name: newsroom.display_name,
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
                            width: oembed.thumbnail_width,
                            height: oembed.thumbnail_height,
                        },
                    ],
                }}
                languageAlternates={alternateLanguageLinks}
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
