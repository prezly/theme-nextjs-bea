import type { NewsroomCompanyInformation } from '@prezly/sdk';

import type { ShareableSocialNetwork, SocialNetwork } from './types';

function prependAtToUsername(username: string): string {
    if (username.startsWith('@')) {
        return username;
    }

    return `@${username}`;
}

function getSocialLink(socialNetwork: SocialNetwork, url: string | null): string | null {
    if (!url || url.startsWith('http') || url.startsWith('www')) {
        return url;
    }

    switch (socialNetwork) {
        case 'facebook':
            return `https://facebook.com/${url}`;
        case 'instagram':
            return `https://instagram.com/${url}/`;
        case 'linkedin':
            return `https://linkedin.com/in/${url}`;
        case 'pinterest':
            return `https://pinterest.com/${url}`;
        case 'tiktok':
            return `https://tiktok.com/${prependAtToUsername(url)}`;
        case 'twitter':
            return `https://twitter.com/${url}`;
        case 'youtube':
            return `https://youtube.com/${url}`;
        default:
            return null;
    }
}

export function getSocialLinks(companyInformation: NewsroomCompanyInformation) {
    const { facebook, instagram, linkedin, pinterest, tiktok, twitter, youtube } =
        companyInformation;

    return {
        facebook: getSocialLink('facebook', facebook),
        instagram: getSocialLink('instagram', instagram),
        linkedin: getSocialLink('linkedin', linkedin),
        pinterest: getSocialLink('pinterest', pinterest),
        tiktok: getSocialLink('tiktok', tiktok),
        twitter: getSocialLink('twitter', twitter),
        youtube: getSocialLink('youtube', youtube),
    };
}

export function getSocialShareUrl(network: ShareableSocialNetwork, url: string) {
    const encodedUrl = encodeURI(url);

    if (!encodedUrl) {
        return undefined;
    }

    switch (network) {
        case 'facebook':
            return `https://www.facebook.com/sharer.php?u=${encodedUrl}`;
        case 'linkedin':
            return `https://www.linkedin.com/shareArticle?url=${encodedUrl}`;
        case 'pinterest':
            return `http://pinterest.com/pin/create/button/?url=${encodedUrl}`;
        case 'twitter':
            return `https://twitter.com/intent/tweet?url=${encodedUrl}`;
        default:
            return undefined;
    }
}
