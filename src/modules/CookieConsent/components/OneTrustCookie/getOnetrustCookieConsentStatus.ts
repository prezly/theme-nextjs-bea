/**
 * - TRUE  - tracking allowed (i.e. user clicked "Allow")
 * - FALSE - tracking disallowed (i.e. user clicked "Disallow" or browser "Do Not Track" mode is ON)
 * - NULL  - unknown (i.e. user didn't click anything yet, and no browser preference set)
 */
export function getOnetrustCookieConsentStatus(categoryId: string): boolean | null {
    if (
        typeof window === 'undefined' ||
        typeof window.OnetrustActiveGroups === 'undefined' ||
        window.OnetrustActiveGroups === null
    ) {
        return null;
    }
    // @see https://my.onetrust.com/s/article/UUID-518074a1-a6da-81c3-be52-bae7685d9c94?language=en_US&topicId=0TO1Q000000ssJBWAY
    return window.OnetrustActiveGroups.includes(categoryId);
}
