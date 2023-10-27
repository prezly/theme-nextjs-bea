import { api } from '@/theme-kit';

import * as ui from './ui';

export async function Contacts() {
    const contacts = await api().contentDelivery.featuredContacts();

    if (contacts.length === 0) {
        return null;
    }

    return <ui.Contacts contacts={contacts} />;
}
