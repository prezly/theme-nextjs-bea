'use client';

import { Elements } from '@prezly/content-renderer-react-js';
import type { BookmarkNode } from '@prezly/story-content-format';

interface Props {
    node: BookmarkNode;
}

export function Bookmark({ node }: Props) {
    if (canRenderBookmarkCard(node.oembed)) {
        return <Elements.Bookmark node={node} />;
    }

    return <UnlinkedBookmark node={node} />;
}

function canRenderBookmarkCard(oembed: BookmarkNode['oembed'] | undefined): boolean {
    if (!canRenderBookmark(oembed?.url)) {
        return false;
    }

    // Provider falls back to the main URL when this is missing. When it is set,
    // homepage() and hostname() parse it with new URL() and throw on "/".
    const providerUrl = oembed?.provider_url;
    if (!providerUrl) {
        return true;
    }

    return canRenderBookmark(providerUrl);
}

// The content renderer builds `new URL(normalizeUrl(url))`. A stored value of
// "/" becomes "http:///", which throws and takes down the whole story page.
function canRenderBookmark(url: string | undefined): boolean {
    if (!url) {
        return false;
    }

    try {
        return new URL(toAbsoluteUrl(url)).hostname.length > 0;
    } catch {
        return false;
    }
}

function toAbsoluteUrl(url: string): string {
    if (url.includes('://')) {
        return url;
    }

    if (url.startsWith('//')) {
        return `http:${url}`;
    }

    return `http://${url}`;
}

function UnlinkedBookmark({ node }: Props) {
    const oembed = node.oembed;
    const title = oembed?.title?.trim() ?? '';
    const description = oembed?.description?.trim() ?? '';
    const thumbnailUrl = oembed?.thumbnail_url;
    const showThumbnail = Boolean(node.show_thumbnail && thumbnailUrl);

    if (!title && !description && !showThumbnail) {
        return null;
    }

    return (
        <div
            className={[
                'prezly-slate-bookmark',
                'prezly-slate-bookmark-card-component__container',
                showThumbnail ? node.layout : 'horizontal',
            ].join(' ')}
        >
            {showThumbnail && thumbnailUrl && (
                <div
                    className="prezly-slate-bookmark-card-component__thumbnail"
                    style={{ backgroundImage: `url("${thumbnailUrl}")` }}
                >
                    {/* Same markup as the content renderer's bookmark thumbnail. */}
                    {/* biome-ignore lint/performance/noImgElement: external oembed thumbnail, not a next image */}
                    <img
                        alt={title}
                        className="prezly-slate-bookmark-card-component__thumbnailImage"
                        height={oembed?.thumbnail_height}
                        src={thumbnailUrl}
                        width={oembed?.thumbnail_width}
                    />
                </div>
            )}
            <div className="prezly-slate-bookmark-card-component__details">
                {title && (
                    <div className="prezly-slate-bookmark-card-component__title">{title}</div>
                )}
                {description && (
                    <div className="prezly-slate-bookmark-card-component__description">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}
