export type CardSize = 'small' | 'medium' | 'big' | 'tiny';

export function getCardImageSizes(cardSize: CardSize) {
    if (cardSize === 'tiny') {
        return {
            default: 60,
        };
    }

    return {
        mobile: 420,
        tablet: cardSize === 'big' ? 350 : 240,
        desktop: getDesktopImageSize(cardSize),
        default: 600,
    };
}

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
