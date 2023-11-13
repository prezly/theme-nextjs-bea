import { app } from '@/theme/server';

import * as ui from './ui';

export async function Contacts() {
    const localeCode = app().locale();
    const contacts = await app().featuredContacts();

    const contactsInCurrentLocale = contacts.filter((contact) =>
        contact.display_locales.find(({ code }) => code === localeCode),
    );

    if (contactsInCurrentLocale.length === 0) {
        return null;
    }

    return <ui.Contacts contacts={contactsInCurrentLocale} />;
}
