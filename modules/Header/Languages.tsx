import { app, routing } from '@/adapters/server';

import * as ui from './ui';

import styles from './ui/Header.module.scss';

export async function Languages() {
    const localeCode = app().locale();
    const languages = await app().languages();
    const { generateUrl } = await routing();

    const homepages: ui.Languages.Option[] = languages.map((lang) => ({
        code: lang.code,
        href: generateUrl('index', { localeCode: lang.code }),
        title: lang.locale.native_name,
        stories: lang.public_stories_count,
    }));

    return (
        <ui.Languages
            selected={localeCode}
            options={homepages}
            buttonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
        />
    );
}
