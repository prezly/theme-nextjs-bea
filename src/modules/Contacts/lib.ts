export function getNumberOfColumns(numberOfContacts: number): number {
    switch (numberOfContacts) {
        case 1:
            return 1;
        case 2:
        case 4:
            return 2;
        default:
            return 3;
    }
}
