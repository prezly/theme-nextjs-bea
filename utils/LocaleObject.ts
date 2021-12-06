import localeConfig from '../locale.config';

export class LocaleObject {
    /**
     * Hyphen-separated locale code.
     * Examples: `nl-BE`, `en-US`, `fr`, `fil`
     */
    private localeCode: string;

    private constructor(localeCode: string) {
        if (localeCode.indexOf('_') !== -1) {
            throw new Error('Invalid locale code provided!');
        }

        this.localeCode = localeCode;
    }

    /**
     * @param localeCode Locale code in any of the formats below.
     * Examples:
     * - Hyphen-codes: `nl-BE`, `en-US`, `fr`, `fil`
     * - Underscore-codes: `nl_BE`, `en_US`, `fr`, `fil`
     * - Slugs: `nl-be`, `en-us`, `fr`, `fil`
     */
    public static fromAnyCode(localeCode: string): LocaleObject {
        const lowercaseCode = localeCode.toLowerCase().replace('_', '-');
        const foundCode = localeConfig.find((code) => code.toLowerCase() === lowercaseCode);

        if (!foundCode) {
            throw new Error('Unsupported locale code provided!');
        }

        return new LocaleObject(foundCode);
    }

    public toHyphenCode(): string {
        return this.localeCode;
    }

    public toUnderscoreCode(): string {
        return this.localeCode.replace('-', '_');
    }

    public toUrlSlug(): string {
        return this.localeCode.toLowerCase();
    }

    public toNeutralLanguageCode(): string {
        const [language] = this.localeCode.split('-');

        return language;
    }

    public toRegionCode(): string {
        if (this.localeCode.length === 2) {
            return this.localeCode.toUpperCase();
        }

        const [, region] = this.localeCode.split('-');

        return region;
    }

    public isEqual(anotherLocale: LocaleObject) {
        return anotherLocale.toHyphenCode() === this.localeCode;
    }
}
