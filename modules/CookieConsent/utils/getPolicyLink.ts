import { Newsroom } from '@prezly/sdk';

const DEFAULT_LINK = '/privacy-policy';

export function getPolicyLink(policy: Newsroom['policies']['cookie_policy']): string {
    if ('link' in policy) {
        return policy.link;
    }

    return DEFAULT_LINK;
}
