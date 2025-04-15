import { Story } from '@prezly/sdk';

import { SocialNetwork } from '@/theme-settings';

interface AdditionalProps {
    thumbnailUrl: Story['thumbnail_url'];
    visibility: Story['visibility'];
}

export function getRenderableSocialSharingNetworks(
    socialNetworks: SocialNetwork[],
    { thumbnailUrl, visibility }: AdditionalProps,
) {
    if (visibility !== Story.Visibility.PUBLIC) {
        return [];
    }

    return socialNetworks.filter((socialNetwork) => {
        if (socialNetwork === SocialNetwork.PINTEREST) {
            return Boolean(thumbnailUrl);
        }

        return true;
    });
}
