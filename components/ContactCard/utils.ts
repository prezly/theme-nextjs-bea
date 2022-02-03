import { SocialLinks } from 'social-links';

import type { Contact } from './types';

export function getSocialHandles(contact: Contact) {
    // Allow query params in social links in case someone decides to use UTM codes
    const socialLinks = new SocialLinks({ allowQueryParams: true });
    const facebook = contact.facebook || '';
    const twitter = contact.twitter || '';

    // We have to check whether the social links are valid first
    // otherwise `getProfileId` method throws an error
    const isValidFacebook = socialLinks.isValid('facebook', facebook);
    const isValidTwitter = socialLinks.isValid('twitter', twitter);

    return {
        facebook: isValidFacebook ? socialLinks.getProfileId('facebook', facebook) : null,
        twitter: isValidTwitter ? socialLinks.getProfileId('twitter', twitter) : null,
    };
}
