import { SocialNetwork } from 'theme-settings';

interface AdditionalProps {
    thumbnailUrl?: string | null;
}

export function getRenderableSocialSharingNetworks(
    socialNetworks: SocialNetwork[],
    { thumbnailUrl }: AdditionalProps,
) {
    return socialNetworks.filter((socialNetwork) => {
        if (socialNetwork === SocialNetwork.PINTEREST) {
            return Boolean(thumbnailUrl);
        }

        return true;
    });
}
