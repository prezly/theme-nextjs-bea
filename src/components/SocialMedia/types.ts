export type SocialNetwork =
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'pinterest'
    | 'tiktok'
    | 'twitter'
    | 'youtube';

/**
 * Instagram, TikTok and YouTube don't provide URL sharing to their networks as of July 2022
 */
export type ShareableSocialNetwork = Exclude<SocialNetwork, 'instagram' | 'tiktok' | 'youtube'>;
