export function getGalleriesLayout(numberOfGalleries: number): [number, number] {
    switch (numberOfGalleries) {
        case 2:
            return [2, 0];
        case 3:
            return [3, 0];
        case 4:
            return [2, 2];
        case 5:
            return [2, 3];
        default:
            return [3, 3];
    }
}
