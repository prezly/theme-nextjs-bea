export function convertToPrezlyFormat(locale: string) {
    return locale.replace('-', '_');
}

export function convertToBrowserFormat(locale: string) {
    return locale.replace('_', '-');
}
