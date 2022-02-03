import type { NewsroomCompanyInformation } from '@prezly/sdk';

import type { SocialNetwork } from './types';

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
