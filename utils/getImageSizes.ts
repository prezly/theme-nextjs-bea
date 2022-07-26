export type CardSize = 'small' | 'medium' | 'big' | 'tiny';

function getDesktopImageSize(cardSize: CardSize) {
    switch (cardSize) {
        case 'medium':
            return 380;
        case 'small':
            return 240;
        default:
            return 600;
    }
}

export function getCardImageSizes(desiredSize: CardSize) {
    if (desiredSize === 'tiny') {
        return {
            default: 60,
        };
    }

    return {
        mobile: 420,
        tablet: desiredSize === 'big' ? 350 : 240,
        desktop: getDesktopImageSize(desiredSize),
        default: 600,
    };
}

export function getStoryImageSizes() {
    return {
        mobile: 420,
        default: 720,
    };
}
