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

        const [language, region] = localeCode.split('-');

        if (region) {
            this.localeCode = [language, region.toUpperCase()].join('-');
        } else {
            this.localeCode = language;
        }
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
        const foundCode = localeConfig.find((code) => code === lowercaseCode);

        if (!foundCode) {
            throw new Error(`Unsupported locale code provided: "${lowercaseCode}"`);
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
        const [language, region] = this.localeCode.split('-');

        if (!region) {
            return language.toUpperCase();
        }

        return region.toUpperCase();
    }

    public isEqual(anotherLocale: LocaleObject) {
        return anotherLocale.toHyphenCode() === this.localeCode;
    }
}
