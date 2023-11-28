import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import * as ui from './ui';

interface Props {
    localeCode: Locale.Code;
}

export async function Contacts({ localeCode }: Props) {
    const contacts = await app().featuredContacts();

    const contactsInCurrentLocale = contacts.filter((contact) =>
        contact.display_locales.find(({ code }) => code === localeCode),
    );

    if (contactsInCurrentLocale.length === 0) {
        return null;
    }

    return <ui.Contacts contacts={contactsInCurrentLocale} />;
}
