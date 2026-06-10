import type { Locale } from '@prezly/theme-kit-nextjs';

import { Boilerplate } from '@/modules/Boilerplate';
import { Contacts } from '@/modules/Contacts';

import styles from './ContactsAndBoilerplate.module.scss';

interface Props {
    localeCode: Locale.Code;
}

/**
 * Renders the "Contact us" grid and the "About" boilerplate together inside a
 * single full-bleed grey band, matching the live newsroom. Used on the home
 * and category pages only.
 */
export function ContactsAndBoilerplate({ localeCode }: Props) {
    return (
        <section className={styles.section}>
            <Contacts localeCode={localeCode} />
            <Boilerplate localeCode={localeCode} />
        </section>
    );
}
