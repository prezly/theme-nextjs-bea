import { api } from '@/theme-kit';
import { intl } from '@/theme-kit/intl/server';

import { LanguagesNav } from './ui';

import styles from './Header.module.scss';

export async function Languages() {
    const { locale } = await intl();
    const { contentDelivery } = api();

    const languages = await contentDelivery.languages();

    const titles = Object.fromEntries(
        languages.map((lang) => [lang.code, lang.locale.native_name]),
    );

    return (
        <LanguagesNav
            localeCode={locale}
            languages={titles}
            buttonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
        />
    );
}
