import { api, locale } from '@/theme-kit';

import * as ui from './ui';

export async function Contacts() {
    const contacts = await api().contentDelivery.featuredContacts();
    const localeCode = locale().code;

    const contactsInCurrentLocale = contacts.filter((contact) =>
        contact.display_locales.find(({ code }) => code === localeCode),
    );

    if (contactsInCurrentLocale.length === 0) {
        return null;
    }

    return <ui.Contacts contacts={contactsInCurrentLocale} />;
}
