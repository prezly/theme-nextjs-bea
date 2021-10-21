import { Newsroom } from '@prezly/sdk';

export interface SubscribeFormData {
    email: string;
}

export const INITIAL_FORM_DATA: SubscribeFormData = { email: '' };
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function getPrivacyPortalUrl(newsroom: Newsroom, email: string) {
    if (!newsroom) {
        return '';
    }

    return `https://privacy.prezly.com/newsroom/${newsroom.uuid}/subscribe?email=${email}`;
}
