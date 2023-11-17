import type { ReactNode } from 'react';

import { Contacts } from '@/modules/Contacts';

interface Props {
    children: ReactNode;
}
export default function HomepageLayout({ children }: Props) {
    return (
        <>
            {children}
            <Contacts />
        </>
    );
}
