import type { ContactNode } from '@prezly/content-format';

export type ContactInfo = Pick<
    ContactNode.ContactInfo,
    | 'name'
    | 'description'
    | 'company'
    | 'email'
    | 'phone'
    | 'mobile'
    | 'website'
    | 'facebook'
    | 'twitter'
>;
