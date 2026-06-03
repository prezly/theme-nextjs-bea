'use client';

import { CookieConsentLink } from '@/modules/CookieConsent';

import styles from './NeumannFooter.module.scss';

// Neumann.Berlin logo served from Uploadcare. We request a 400x400 preview in
// auto format/best quality (matching the live newsroom) and render it capped at
// 200px wide via CSS.
const NEUMANN_LOGO_URL =
    'https://cdn.uc.assets.prezly.com/3d3af644-6018-4658-aea1-2009c10447c5/-/preview/400x400/-/quality/best/-/format/auto/';

// Mapping from newsroom locale codes to neumann.com locale codes
const localeMapping: Record<string, string> = {
    // Chinese
    zh: 'zh-cn',
    // Danish
    da: 'da',
    // Dutch
    'nl-be': 'nl-be',
    'nl-nl': 'nl-nl',
    // English
    au: 'en-au',
    'en-ca': 'en-ca',
    gb: 'en-gb',
    us: 'en-us',
    en: 'en-us', // Default English
    // Finnish
    fi: 'fi',
    // French
    'fr-be': 'fr-be',
    'fr-ca': 'fr-ca',
    'fr-fr': 'fr-fr',
    // German
    at: 'de-at',
    'de-de': 'de-de',
    ch: 'de-ch',
    // Indonesian
    id: 'id',
    // Japanese
    ja: 'ja',
    // Norwegian
    nb: 'nb',
    // Portuguese
    pt: 'pt-br',
    // Spanish
    es: 'es-419',
    // Swedish
    sv: 'sv',
};

// Help center locale mapping (different structure)
const helpCenterLocaleMapping: Record<string, string> = {
    zh: 'zh-cn',
    da: 'da',
    'nl-be': 'nl',
    'nl-nl': 'nl',
    au: 'en-au',
    'en-ca': 'en-us',
    gb: 'en-gb',
    us: 'en-us',
    en: 'en-us',
    fi: 'fi',
    'fr-be': 'fr',
    'fr-ca': 'fr-ca',
    'fr-fr': 'fr',
    at: 'de',
    'de-de': 'de',
    ch: 'de',
    id: 'id',
    ja: 'ja',
    nb: 'no',
    pt: 'pt-br',
    es: 'es',
    sv: 'sv',
};

// Translations for all footer text
type TranslationKey =
    | 'company'
    | 'aboutUs'
    | 'press'
    | 'stories'
    | 'b2b'
    | 'homeStudio'
    | 'newsletter'
    | 'jobs'
    | 'cookieSettings'
    | 'serviceSupport'
    | 'downloads'
    | 'warranty'
    | 'service'
    | 'distributors'
    | 'glossaryMicrophones'
    | 'glossaryMonitors'
    | 'contactUs'
    | 'products'
    | 'microphones'
    | 'microphoneAccessories'
    | 'preamplifiers'
    | 'monitors'
    | 'monitorAccessories'
    | 'headphones'
    | 'historicalProducts'
    | 'audioInterface'
    | 'imprint'
    | 'termsOfUse'
    | 'privacyPolicy'
    | 'termsConditions'
    | 'rightOfCancellation'
    | 'accessibilityStatement'
    | 'productRelatedProtection';

const translations: Record<string, Record<TranslationKey, string>> = {
    en: {
        company: 'Company',
        aboutUs: 'About us',
        press: 'Press',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann in the Home Studio',
        newsletter: 'Newsletter Registration',
        jobs: 'Jobs',
        cookieSettings: 'Cookie Settings',
        serviceSupport: 'Service & Support',
        downloads: 'Downloads',
        warranty: 'Warranty',
        service: 'Service',
        distributors: 'Distributor & Service Points',
        glossaryMicrophones: 'Glossary Microphones',
        glossaryMonitors: 'Glossary Monitors',
        contactUs: 'Contact us',
        products: 'Products',
        microphones: 'Microphones',
        microphoneAccessories: 'Microphone Accessories',
        preamplifiers: 'Preamplifiers',
        monitors: 'Monitors',
        monitorAccessories: 'Monitor Accessories',
        headphones: 'Headphones',
        historicalProducts: 'Historical Products',
        audioInterface: 'Audio Interface',
        imprint: 'Imprint',
        termsOfUse: 'Terms of use',
        privacyPolicy: 'Privacy policy',
        termsConditions: 'Terms & Conditions',
        rightOfCancellation: 'Right of cancelation',
        accessibilityStatement: 'Accessibility Statement',
        productRelatedProtection: 'Product-related Protection of our Environment',
    },
    de: {
        company: 'Unternehmen',
        aboutUs: 'Über uns',
        press: 'Presse',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann im Home Studio',
        newsletter: 'Newsletter-Anmeldung',
        jobs: 'Jobs',
        cookieSettings: 'Cookie-Einstellungen',
        serviceSupport: 'Service & Support',
        downloads: 'Downloads',
        warranty: 'Garantie',
        service: 'Service',
        distributors: 'Händler & Servicepartner',
        glossaryMicrophones: 'Glossar Mikrofone',
        glossaryMonitors: 'Glossar Monitore',
        contactUs: 'Kontakt',
        products: 'Produkte',
        microphones: 'Mikrofone',
        microphoneAccessories: 'Mikrofonzubehör',
        preamplifiers: 'Vorverstärker',
        monitors: 'Monitore',
        monitorAccessories: 'Monitorzubehör',
        headphones: 'Kopfhörer',
        historicalProducts: 'Historische Produkte',
        audioInterface: 'Audio Interface',
        imprint: 'Impressum',
        termsOfUse: 'Nutzungsbedingungen',
        privacyPolicy: 'Datenschutz',
        termsConditions: 'AGB',
        rightOfCancellation: 'Widerrufsrecht',
        accessibilityStatement: 'Barrierefreiheit',
        productRelatedProtection: 'Produktbezogener Umweltschutz',
    },
    fr: {
        company: 'Entreprise',
        aboutUs: 'À propos',
        press: 'Presse',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann en Home Studio',
        newsletter: 'Inscription à la newsletter',
        jobs: 'Emplois',
        cookieSettings: 'Paramètres des cookies',
        serviceSupport: 'Service & Support',
        downloads: 'Téléchargements',
        warranty: 'Garantie',
        service: 'Service',
        distributors: 'Distributeurs & Points de service',
        glossaryMicrophones: 'Glossaire Microphones',
        glossaryMonitors: 'Glossaire Moniteurs',
        contactUs: 'Contactez-nous',
        products: 'Produits',
        microphones: 'Microphones',
        microphoneAccessories: 'Accessoires Microphones',
        preamplifiers: 'Préamplificateurs',
        monitors: 'Moniteurs',
        monitorAccessories: 'Accessoires Moniteurs',
        headphones: 'Casques',
        historicalProducts: 'Produits historiques',
        audioInterface: 'Interface Audio',
        imprint: 'Mentions légales',
        termsOfUse: "Conditions d'utilisation",
        privacyPolicy: 'Politique de confidentialité',
        termsConditions: 'CGV',
        rightOfCancellation: 'Droit de rétractation',
        accessibilityStatement: 'Accessibilité',
        productRelatedProtection: 'Protection environnementale liée aux produits',
    },
    nl: {
        company: 'Bedrijf',
        aboutUs: 'Over ons',
        press: 'Pers',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann in de Home Studio',
        newsletter: 'Nieuwsbrief aanmelding',
        jobs: 'Vacatures',
        cookieSettings: 'Cookie-instellingen',
        serviceSupport: 'Service & Support',
        downloads: 'Downloads',
        warranty: 'Garantie',
        service: 'Service',
        distributors: 'Distributeurs & Servicepunten',
        glossaryMicrophones: 'Woordenlijst Microfoons',
        glossaryMonitors: 'Woordenlijst Monitors',
        contactUs: 'Neem contact op',
        products: 'Producten',
        microphones: 'Microfoons',
        microphoneAccessories: 'Microfoon Accessoires',
        preamplifiers: 'Voorversterkers',
        monitors: 'Monitors',
        monitorAccessories: 'Monitor Accessoires',
        headphones: 'Hoofdtelefoons',
        historicalProducts: 'Historische Producten',
        audioInterface: 'Audio Interface',
        imprint: 'Colofon',
        termsOfUse: 'Gebruiksvoorwaarden',
        privacyPolicy: 'Privacybeleid',
        termsConditions: 'Algemene voorwaarden',
        rightOfCancellation: 'Herroepingsrecht',
        accessibilityStatement: 'Toegankelijkheidsverklaring',
        productRelatedProtection: 'Productgerelateerde milieubescherming',
    },
    es: {
        company: 'Empresa',
        aboutUs: 'Sobre nosotros',
        press: 'Prensa',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann en el Home Studio',
        newsletter: 'Suscripción al boletín',
        jobs: 'Empleos',
        cookieSettings: 'Configuración de cookies',
        serviceSupport: 'Servicio y Soporte',
        downloads: 'Descargas',
        warranty: 'Garantía',
        service: 'Servicio',
        distributors: 'Distribuidores y Puntos de Servicio',
        glossaryMicrophones: 'Glosario Micrófonos',
        glossaryMonitors: 'Glosario Monitores',
        contactUs: 'Contáctenos',
        products: 'Productos',
        microphones: 'Micrófonos',
        microphoneAccessories: 'Accesorios de Micrófono',
        preamplifiers: 'Preamplificadores',
        monitors: 'Monitores',
        monitorAccessories: 'Accesorios de Monitor',
        headphones: 'Auriculares',
        historicalProducts: 'Productos Históricos',
        audioInterface: 'Interfaz de Audio',
        imprint: 'Aviso legal',
        termsOfUse: 'Condiciones de uso',
        privacyPolicy: 'Política de privacidad',
        termsConditions: 'Términos y Condiciones',
        rightOfCancellation: 'Derecho de desistimiento',
        accessibilityStatement: 'Declaración de accesibilidad',
        productRelatedProtection: 'Protección ambiental relacionada con el producto',
    },
    pt: {
        company: 'Empresa',
        aboutUs: 'Sobre nós',
        press: 'Imprensa',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann no Home Studio',
        newsletter: 'Inscrição na newsletter',
        jobs: 'Vagas',
        cookieSettings: 'Configurações de cookies',
        serviceSupport: 'Serviço e Suporte',
        downloads: 'Downloads',
        warranty: 'Garantia',
        service: 'Serviço',
        distributors: 'Distribuidores e Pontos de Serviço',
        glossaryMicrophones: 'Glossário Microfones',
        glossaryMonitors: 'Glossário Monitores',
        contactUs: 'Fale conosco',
        products: 'Produtos',
        microphones: 'Microfones',
        microphoneAccessories: 'Acessórios de Microfone',
        preamplifiers: 'Pré-amplificadores',
        monitors: 'Monitores',
        monitorAccessories: 'Acessórios de Monitor',
        headphones: 'Fones de ouvido',
        historicalProducts: 'Produtos Históricos',
        audioInterface: 'Interface de Áudio',
        imprint: 'Expediente',
        termsOfUse: 'Termos de uso',
        privacyPolicy: 'Política de privacidade',
        termsConditions: 'Termos e Condições',
        rightOfCancellation: 'Direito de cancelamento',
        accessibilityStatement: 'Declaração de acessibilidade',
        productRelatedProtection: 'Proteção ambiental relacionada ao produto',
    },
    ja: {
        company: '会社情報',
        aboutUs: '会社概要',
        press: 'プレス',
        stories: 'ストーリー',
        b2b: 'B2B',
        homeStudio: 'ホームスタジオのNeumann',
        newsletter: 'ニュースレター登録',
        jobs: '採用情報',
        cookieSettings: 'Cookie設定',
        serviceSupport: 'サービス＆サポート',
        downloads: 'ダウンロード',
        warranty: '保証',
        service: 'サービス',
        distributors: '販売代理店＆サービスポイント',
        glossaryMicrophones: 'マイクロフォン用語集',
        glossaryMonitors: 'モニター用語集',
        contactUs: 'お問い合わせ',
        products: '製品',
        microphones: 'マイクロフォン',
        microphoneAccessories: 'マイクアクセサリー',
        preamplifiers: 'プリアンプ',
        monitors: 'モニター',
        monitorAccessories: 'モニターアクセサリー',
        headphones: 'ヘッドフォン',
        historicalProducts: '歴史的製品',
        audioInterface: 'オーディオインターフェース',
        imprint: '運営者情報',
        termsOfUse: '利用規約',
        privacyPolicy: 'プライバシーポリシー',
        termsConditions: '利用規約',
        rightOfCancellation: 'キャンセルポリシー',
        accessibilityStatement: 'アクセシビリティ',
        productRelatedProtection: '製品関連の環境保護',
    },
    zh: {
        company: '公司',
        aboutUs: '关于我们',
        press: '新闻',
        stories: '故事',
        b2b: 'B2B',
        homeStudio: 'Neumann家庭工作室',
        newsletter: '订阅通讯',
        jobs: '招聘',
        cookieSettings: 'Cookie设置',
        serviceSupport: '服务与支持',
        downloads: '下载',
        warranty: '保修',
        service: '服务',
        distributors: '经销商和服务点',
        glossaryMicrophones: '麦克风术语表',
        glossaryMonitors: '监听音箱术语表',
        contactUs: '联系我们',
        products: '产品',
        microphones: '麦克风',
        microphoneAccessories: '麦克风配件',
        preamplifiers: '前置放大器',
        monitors: '监听音箱',
        monitorAccessories: '监听音箱配件',
        headphones: '耳机',
        historicalProducts: '历史产品',
        audioInterface: '音频接口',
        imprint: '版本说明',
        termsOfUse: '使用条款',
        privacyPolicy: '隐私政策',
        termsConditions: '条款与条件',
        rightOfCancellation: '取消权',
        accessibilityStatement: '无障碍声明',
        productRelatedProtection: '产品相关环境保护',
    },
    da: {
        company: 'Virksomhed',
        aboutUs: 'Om os',
        press: 'Presse',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann i Home Studio',
        newsletter: 'Nyhedsbrev tilmelding',
        jobs: 'Jobs',
        cookieSettings: 'Cookie-indstillinger',
        serviceSupport: 'Service & Support',
        downloads: 'Downloads',
        warranty: 'Garanti',
        service: 'Service',
        distributors: 'Distributører & Servicepunkter',
        glossaryMicrophones: 'Ordliste Mikrofoner',
        glossaryMonitors: 'Ordliste Monitorer',
        contactUs: 'Kontakt os',
        products: 'Produkter',
        microphones: 'Mikrofoner',
        microphoneAccessories: 'Mikrofontilbehør',
        preamplifiers: 'Forforstærkere',
        monitors: 'Monitorer',
        monitorAccessories: 'Monitortilbehør',
        headphones: 'Hovedtelefoner',
        historicalProducts: 'Historiske produkter',
        audioInterface: 'Audio Interface',
        imprint: 'Kolofon',
        termsOfUse: 'Brugsbetingelser',
        privacyPolicy: 'Privatlivspolitik',
        termsConditions: 'Vilkår og betingelser',
        rightOfCancellation: 'Fortrydelsesret',
        accessibilityStatement: 'Tilgængelighedserklæring',
        productRelatedProtection: 'Produktrelateret miljøbeskyttelse',
    },
    fi: {
        company: 'Yritys',
        aboutUs: 'Tietoa meistä',
        press: 'Lehdistö',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann kotistudiossa',
        newsletter: 'Uutiskirjeen tilaus',
        jobs: 'Työpaikat',
        cookieSettings: 'Eväste-asetukset',
        serviceSupport: 'Palvelu & Tuki',
        downloads: 'Lataukset',
        warranty: 'Takuu',
        service: 'Palvelu',
        distributors: 'Jakelijat & Huoltopisteet',
        glossaryMicrophones: 'Sanasto Mikrofonit',
        glossaryMonitors: 'Sanasto Monitorit',
        contactUs: 'Ota yhteyttä',
        products: 'Tuotteet',
        microphones: 'Mikrofonit',
        microphoneAccessories: 'Mikrofonitarvikkeet',
        preamplifiers: 'Esivahvistimet',
        monitors: 'Monitorit',
        monitorAccessories: 'Monitoritarvikkeet',
        headphones: 'Kuulokkeet',
        historicalProducts: 'Historialliset tuotteet',
        audioInterface: 'Äänikortti',
        imprint: 'Julkaisutiedot',
        termsOfUse: 'Käyttöehdot',
        privacyPolicy: 'Tietosuojakäytäntö',
        termsConditions: 'Ehdot',
        rightOfCancellation: 'Peruutusoikeus',
        accessibilityStatement: 'Saavutettavuusseloste',
        productRelatedProtection: 'Tuotekohtainen ympäristönsuojelu',
    },
    id: {
        company: 'Perusahaan',
        aboutUs: 'Tentang kami',
        press: 'Pers',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann di Home Studio',
        newsletter: 'Pendaftaran Newsletter',
        jobs: 'Lowongan',
        cookieSettings: 'Pengaturan Cookie',
        serviceSupport: 'Layanan & Dukungan',
        downloads: 'Unduhan',
        warranty: 'Garansi',
        service: 'Layanan',
        distributors: 'Distributor & Titik Layanan',
        glossaryMicrophones: 'Glosarium Mikrofon',
        glossaryMonitors: 'Glosarium Monitor',
        contactUs: 'Hubungi kami',
        products: 'Produk',
        microphones: 'Mikrofon',
        microphoneAccessories: 'Aksesori Mikrofon',
        preamplifiers: 'Preamplifier',
        monitors: 'Monitor',
        monitorAccessories: 'Aksesori Monitor',
        headphones: 'Headphone',
        historicalProducts: 'Produk Historis',
        audioInterface: 'Audio Interface',
        imprint: 'Imprint',
        termsOfUse: 'Ketentuan penggunaan',
        privacyPolicy: 'Kebijakan privasi',
        termsConditions: 'Syarat & Ketentuan',
        rightOfCancellation: 'Hak pembatalan',
        accessibilityStatement: 'Pernyataan aksesibilitas',
        productRelatedProtection: 'Perlindungan lingkungan terkait produk',
    },
    nb: {
        company: 'Selskap',
        aboutUs: 'Om oss',
        press: 'Presse',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann i hjemmestudioet',
        newsletter: 'Nyhetsbrev registrering',
        jobs: 'Jobber',
        cookieSettings: 'Informasjonskapsel-innstillinger',
        serviceSupport: 'Service & Support',
        downloads: 'Nedlastinger',
        warranty: 'Garanti',
        service: 'Service',
        distributors: 'Distributører & Servicepunkter',
        glossaryMicrophones: 'Ordliste Mikrofoner',
        glossaryMonitors: 'Ordliste Monitorer',
        contactUs: 'Kontakt oss',
        products: 'Produkter',
        microphones: 'Mikrofoner',
        microphoneAccessories: 'Mikrofontilbehør',
        preamplifiers: 'Forforsterkere',
        monitors: 'Monitorer',
        monitorAccessories: 'Monitortilbehør',
        headphones: 'Hodetelefoner',
        historicalProducts: 'Historiske produkter',
        audioInterface: 'Audio Interface',
        imprint: 'Kolofon',
        termsOfUse: 'Bruksvilkår',
        privacyPolicy: 'Personvern',
        termsConditions: 'Vilkår og betingelser',
        rightOfCancellation: 'Angrerett',
        accessibilityStatement: 'Tilgjengelighetserklæring',
        productRelatedProtection: 'Produktrelatert miljøvern',
    },
    sv: {
        company: 'Företag',
        aboutUs: 'Om oss',
        press: 'Press',
        stories: 'Stories',
        b2b: 'B2B',
        homeStudio: 'Neumann i hemstudion',
        newsletter: 'Nyhetsbrev registrering',
        jobs: 'Jobb',
        cookieSettings: 'Cookie-inställningar',
        serviceSupport: 'Service & Support',
        downloads: 'Nedladdningar',
        warranty: 'Garanti',
        service: 'Service',
        distributors: 'Distributörer & Servicepunkter',
        glossaryMicrophones: 'Ordlista Mikrofoner',
        glossaryMonitors: 'Ordlista Monitorer',
        contactUs: 'Kontakta oss',
        products: 'Produkter',
        microphones: 'Mikrofoner',
        microphoneAccessories: 'Mikrofontillbehör',
        preamplifiers: 'Förförstärkare',
        monitors: 'Monitorer',
        monitorAccessories: 'Monitortillbehör',
        headphones: 'Hörlurar',
        historicalProducts: 'Historiska produkter',
        audioInterface: 'Audio Interface',
        imprint: 'Impressum',
        termsOfUse: 'Användarvillkor',
        privacyPolicy: 'Integritetspolicy',
        termsConditions: 'Villkor',
        rightOfCancellation: 'Ångerrätt',
        accessibilityStatement: 'Tillgänglighetsutlåtande',
        productRelatedProtection: 'Produktrelaterat miljöskydd',
    },
};

// Get base language from locale code (e.g., "de_DE" -> "de", "fr-fr" -> "fr")
function getBaseLanguage(localeCode: string): string {
    const code = normalizeLocaleCode(localeCode);
    if (code.startsWith('de') || code === 'at' || code === 'ch') return 'de';
    if (code.startsWith('fr')) return 'fr';
    if (code.startsWith('nl')) return 'nl';
    if (code.startsWith('en') || code === 'au' || code === 'gb' || code === 'us') return 'en';
    if (code === 'es') return 'es';
    if (code === 'pt') return 'pt';
    if (code === 'ja') return 'ja';
    if (code === 'zh') return 'zh';
    if (code === 'da') return 'da';
    if (code === 'fi') return 'fi';
    if (code === 'id') return 'id';
    if (code === 'nb') return 'nb';
    if (code === 'sv') return 'sv';
    return 'en'; // Default to English
}

// Get translation for a key
function t(localeCode: string, key: TranslationKey): string {
    const baseLang = getBaseLanguage(localeCode);
    return translations[baseLang]?.[key] || translations.en[key];
}

// Normalize locale code (convert de_DE to de-de, en_US to us, etc.)
function normalizeLocaleCode(localeCode: string): string {
    return localeCode.toLowerCase().replace('_', '-');
}

// Get the neumann.com locale code for URLs
function getNeumannLocale(localeCode: string): string {
    const normalized = normalizeLocaleCode(localeCode);
    return localeMapping[normalized] || 'en-us';
}

// Get the help center locale code
function getHelpCenterLocale(localeCode: string): string {
    const normalized = normalizeLocaleCode(localeCode);
    return helpCenterLocaleMapping[normalized] || 'en-us';
}

interface FooterLink {
    text: string;
    href: string;
    type?: 'cookie';
}

interface Props {
    localeCode: string;
}

export function NeumannFooter({ localeCode }: Props) {
    const currentYear = new Date().getFullYear();
    const neumannLocale = getNeumannLocale(localeCode);
    const helpLocale = getHelpCenterLocale(localeCode);

    const footerSections: { heading: string; links: FooterLink[] }[] = [
        {
            heading: t(localeCode, 'company'),
            links: [
                {
                    text: t(localeCode, 'aboutUs'),
                    href: `https://www.neumann.com/${neumannLocale}/company/about-us`,
                },
                { text: t(localeCode, 'press'), href: `/${localeCode}/category/press` },
                { text: t(localeCode, 'stories'), href: `/${localeCode}/category/stories` },
                {
                    text: t(localeCode, 'b2b'),
                    href: `https://www.neumann.com/${neumannLocale}/login`,
                },
                {
                    text: t(localeCode, 'homeStudio'),
                    href: `https://www.neumann.com/${neumannLocale}/knowledge-base/neumann-im-homestudio/homestudio-academy`,
                },
                {
                    text: t(localeCode, 'newsletter'),
                    href: `https://www.neumann.com/${neumannLocale}/company/newsletter`,
                },
                {
                    text: t(localeCode, 'jobs'),
                    href: `https://www.neumann.com/${neumannLocale}/company/jobs`,
                },
                { text: t(localeCode, 'cookieSettings'), href: '#', type: 'cookie' },
            ],
        },
        {
            heading: t(localeCode, 'serviceSupport'),
            links: [
                {
                    text: t(localeCode, 'downloads'),
                    href: `https://www.neumann.com/${neumannLocale}/serviceundsupport/file-finder`,
                },
                {
                    text: t(localeCode, 'warranty'),
                    href: `https://www.neumann.com/${neumannLocale}/serviceundsupport/warranty`,
                },
                {
                    text: t(localeCode, 'service'),
                    href: `https://www.neumann.com/${neumannLocale}/serviceundsupport/service`,
                },
                {
                    text: t(localeCode, 'distributors'),
                    href: `https://www.neumann.com/${neumannLocale}/serviceundsupport/distributors`,
                },
                {
                    text: t(localeCode, 'glossaryMicrophones'),
                    href: `https://www.neumann.com/${neumannLocale}/knowledge-base/glossary/glossary-microphones`,
                },
                {
                    text: t(localeCode, 'glossaryMonitors'),
                    href: `https://www.neumann.com/${neumannLocale}/knowledge-base/glossary/glossary-monitors`,
                },
                {
                    text: t(localeCode, 'contactUs'),
                    href: `https://help.neumann.com/hc/${helpLocale}/requests/new`,
                },
            ],
        },
        {
            heading: t(localeCode, 'products'),
            links: [
                {
                    text: t(localeCode, 'microphones'),
                    href: `https://www.neumann.com/${neumannLocale}/products/microphones`,
                },
                {
                    text: t(localeCode, 'microphoneAccessories'),
                    href: `https://www.neumann.com/${neumannLocale}/products/microphone-accessories`,
                },
                {
                    text: t(localeCode, 'preamplifiers'),
                    href: `https://www.neumann.com/${neumannLocale}/products/historical/v-402`,
                },
                {
                    text: t(localeCode, 'monitors'),
                    href: `https://www.neumann.com/${neumannLocale}/products/monitors`,
                },
                {
                    text: t(localeCode, 'monitorAccessories'),
                    href: `https://www.neumann.com/${neumannLocale}/products/monitor-accessories`,
                },
                {
                    text: t(localeCode, 'headphones'),
                    href: `https://www.neumann.com/${neumannLocale}/products/headphones`,
                },
                {
                    text: t(localeCode, 'historicalProducts'),
                    href: `https://www.neumann.com/${neumannLocale}/products/historical`,
                },
                {
                    text: t(localeCode, 'audioInterface'),
                    href: `https://www.neumann.com/${neumannLocale}/products/audiointerfaces/mt-48`,
                },
            ],
        },
    ];

    const legalLinks = [
        {
            text: t(localeCode, 'imprint'),
            href: `https://www.neumann.com/${neumannLocale}/legal/imprint`,
        },
        {
            text: t(localeCode, 'termsOfUse'),
            href: `https://www.neumann.com/${neumannLocale}/legal/terms-of-service`,
        },
        {
            text: t(localeCode, 'privacyPolicy'),
            href: `https://www.neumann.com/${neumannLocale}/legal/privacy-policy`,
        },
        {
            text: t(localeCode, 'termsConditions'),
            href: `https://www.neumann.com/${neumannLocale}/legal/terms-and-conditions`,
        },
        {
            text: t(localeCode, 'rightOfCancellation'),
            href: `https://www.neumann.com/${neumannLocale}/legal/right-of-cancellation`,
        },
        {
            text: t(localeCode, 'accessibilityStatement'),
            href: `https://www.neumann.com/${neumannLocale}/legal/accessibility-statement`,
        },
        {
            text: t(localeCode, 'productRelatedProtection'),
            href: `https://www.neumann.com/${neumannLocale}/legal/product-related-protection-of-our-environment`,
        },
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main footer columns */}
                <div className={styles.columns}>
                    {footerSections.map((section) => (
                        <div key={section.heading} className={styles.column}>
                            <h5 className={styles.heading}>{section.heading}</h5>
                            <ul className={styles.list}>
                                {section.links.map((link) => (
                                    <li key={link.text}>
                                        {link.type === 'cookie' ? (
                                            <CookieConsentLink
                                                className={styles.link}
                                                startUsingCookiesLabel={link.text}
                                                stopUsingCookiesLabel={link.text}
                                            />
                                        ) : (
                                            <a
                                                href={link.href}
                                                className={styles.link}
                                                target={
                                                    link.href.startsWith('http')
                                                        ? '_blank'
                                                        : undefined
                                                }
                                                rel={
                                                    link.href.startsWith('http')
                                                        ? 'noopener noreferrer'
                                                        : undefined
                                                }
                                            >
                                                {link.text}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Center: Neumann.Berlin logo */}
                <div className={styles.brand}>
                    <a href={`/${localeCode}`} className={styles.logo} aria-label="Neumann.Berlin">
                        {/* biome-ignore lint/performance/noImgElement: fixed brand asset served by Uploadcare CDN; next/image optimization is unnecessary and would require remotePatterns config */}
                        <img
                            src={NEUMANN_LOGO_URL}
                            alt="Neumann.Berlin"
                            width={200}
                            height={200}
                        />
                    </a>
                </div>

                {/* Bottom strip: copyright + legal */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        &copy; 2018 - {currentYear}{' '}
                        <a
                            href={`https://www.neumann.com/${neumannLocale}/`}
                            className={styles.copyrightLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Georg Neumann GmbH
                        </a>
                    </p>
                    <ul className={styles.legal}>
                        {legalLinks.map((link) => (
                            <li key={link.text}>
                                <a
                                    href={link.href}
                                    className={styles.legalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
