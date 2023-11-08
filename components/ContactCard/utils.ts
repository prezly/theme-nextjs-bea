import { SocialLinks } from 'social-links';

import type { ContactInfo } from './types';

export function getSocialHandles(contactInfo: ContactInfo) {
    // Allow query params in social links in case someone decides to use UTM codes
    const socialLinks = new SocialLinks({ allowQueryParams: true });
    const facebook = contactInfo.facebook || '';
    let twitter = contactInfo.twitter || '';

    // social-links does not recognize x.com and since x.com/username
    // will just redirect you to twitter.com, we can simply replace the domain
    twitter = twitter.replace('x.com', 'twitter.com');

    // We have to check whether the social links are valid first
    // otherwise `getProfileId` method throws an error
    const isValidFacebook = socialLinks.isValid('facebook', facebook);
    const isValidTwitter = socialLinks.isValid('twitter', twitter);

    return {
        facebook: isValidFacebook ? socialLinks.getProfileId('facebook', facebook) : null,
        twitter: isValidTwitter ? socialLinks.getProfileId('twitter', twitter) : null,
    };
}
