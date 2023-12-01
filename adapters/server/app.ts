import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';
import { AppHelperAdapter } from '@prezly/theme-kit-nextjs/server';
// import { headers } from 'next/headers';

import { initPrezlyClient } from './prezly';
import { themeSettings } from './theme-settings';

export const { useApp: app } = AppHelperAdapter.connect({
    // identifyRequestContext: () => headers(),
    createAppHelper: () => {
        const { contentDelivery } = initPrezlyClient();

        function story(params: ContentDelivery.story.SearchParams) {
            return contentDelivery.story(params);
        }

        function stories(params: ContentDelivery.stories.SearchParams) {
            return contentDelivery.stories(params, { include: ['thumbnail_image'] });
        }

        function allStories(params?: ContentDelivery.allStories.SearchParams) {
            return contentDelivery.allStories(params, { include: ['thumbnail_image'] });
        }

        return {
            ...contentDelivery,
            timezone: () => contentDelivery.newsroom().then((newsroom) => newsroom.timezone),
            languagesSnapshot() {
                return [
                    {
                        code: 'af_ZA',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ar_BH',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ar_AE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'az',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'be',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'hr_HR',
                        is_default: false,
                        public_stories_count: 1,
                    },
                    {
                        code: 'cs_CZ',
                        is_default: false,
                        public_stories_count: 1,
                    },
                    {
                        code: 'da_DK',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'nl',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'nl_BE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'nl_NL',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en',
                        is_default: false,
                        public_stories_count: 11,
                    },
                    {
                        code: 'en_AU',
                        is_default: false,
                        public_stories_count: 1,
                    },
                    {
                        code: 'en_BH',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_BD',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_BE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_KH',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_CA',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_CN',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_DK',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_DE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_HK',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_IN',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_ID',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_IE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_IL',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_JM',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_JP',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_KR',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_MY',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_MV',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_MM',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_NP',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_NZ',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_PK',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_PH',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_QA',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_SA',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_SG',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_ZA',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_LK',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_TW',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_TH',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_AE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_GB',
                        is_default: true,
                        public_stories_count: 39,
                    },
                    {
                        code: 'en_US',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'en_VN',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'et_EE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'fil',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'fi_FI',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'fr',
                        is_default: false,
                        public_stories_count: 1,
                    },
                    {
                        code: 'fr_BE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'fr_CA',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'fr_FR',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'fr_LU',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'de',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'de_AT',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'de_BE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'de_DE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'de_CH',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'el_GR',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'he_IL',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'hi_IN',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'hu_HU',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'id_ID',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ga_IE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'it_IT',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ja_JP',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'kk',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ko_KR',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ky',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'lv_LV',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'lt_LT',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ms_MY',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'mt_MT',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'nb_NO',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'pl_PL',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'pt',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'pt_BR',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'pt_PT',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ro_RO',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ru_RU',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'sk_SK',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'sl_SI',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'es',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'es_419',
                        is_default: false,
                        public_stories_count: 1,
                    },
                    {
                        code: 'es_MX',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'es_ES',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'sw',
                        is_default: false,
                        public_stories_count: 1,
                    },
                    {
                        code: 'sv_SE',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'th_TH',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'tr_TR',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'uk_UA',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'ur_PK',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'uz',
                        is_default: false,
                        public_stories_count: 0,
                    },
                    {
                        code: 'vi_VN',
                        is_default: false,
                        public_stories_count: 0,
                    },
                ] satisfies {
                    code: Locale.Code;
                    is_default: boolean;
                    public_stories_count: number;
                }[];
            },
            locales(): Locale.Code[] {
                return [
                    'af_ZA',
                    'ar_BH',
                    'ar_AE',
                    'az',
                    'be',
                    'hr_HR',
                    'cs_CZ',
                    'da_DK',
                    'nl',
                    'nl_BE',
                    'nl_NL',
                    'en',
                    'en_AU',
                    'en_BH',
                    'en_BD',
                    'en_BE',
                    'en_KH',
                    'en_CA',
                    'en_CN',
                    'en_DK',
                    'en_DE',
                    'en_HK',
                    'en_IN',
                    'en_ID',
                    'en_IE',
                    'en_IL',
                    'en_JM',
                    'en_JP',
                    'en_KR',
                    'en_MY',
                    'en_MV',
                    'en_MM',
                    'en_NP',
                    'en_NZ',
                    'en_PK',
                    'en_PH',
                    'en_QA',
                    'en_SA',
                    'en_SG',
                    'en_ZA',
                    'en_LK',
                    'en_TW',
                    'en_TH',
                    'en_AE',
                    'en_GB',
                    'en_US',
                    'en_VN',
                    'et_EE',
                    'fil',
                    'fi_FI',
                    'fr',
                    'fr_BE',
                    'fr_CA',
                    'fr_FR',
                    'fr_LU',
                    'de',
                    'de_AT',
                    'de_BE',
                    'de_DE',
                    'de_CH',
                    'el_GR',
                    'he_IL',
                    'hi_IN',
                    'hu_HU',
                    'id_ID',
                    'ga_IE',
                    'it_IT',
                    'ja_JP',
                    'kk',
                    'ko_KR',
                    'ky',
                    'lv_LV',
                    'lt_LT',
                    'ms_MY',
                    'mt_MT',
                    'nb_NO',
                    'pl_PL',
                    'pt',
                    'pt_BR',
                    'pt_PT',
                    'ro_RO',
                    'ru_RU',
                    'sk_SK',
                    'sl_SI',
                    'es',
                    'es_419',
                    'es_MX',
                    'es_ES',
                    'sw',
                    'sv_SE',
                    'th_TH',
                    'tr_TR',
                    'uk_UA',
                    'ur_PK',
                    'uz',
                    'vi_VN',
                ];
            },
            defaultLocale(): Locale.Code {
                return 'en_GB';
            },
            story,
            stories,
            allStories,
            themeSettings,
            preload() {
                contentDelivery.languages();
                contentDelivery.newsroom();
            },
        };
    },
});
