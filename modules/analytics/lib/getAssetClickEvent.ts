import { STORY_ASSET, STORY_CONTACT, STORY_EMBED, STORY_FILE, STORY_IMAGE } from '../events';

export function getAssetClickEvent(type: string): string {
    switch (type) {
        case 'attachment':
            return STORY_FILE.CLICK;

        case 'contact':
            return STORY_CONTACT.CLICK;

        case 'embed':
            return STORY_EMBED.CLICK;

        case 'image':
            return STORY_IMAGE.CLICK;

        default:
            return STORY_ASSET.CLICK;
    }
}
