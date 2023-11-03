import { Analytics } from '@prezly/analytics-nextjs';
import { Notification, Story } from '@prezly/sdk';
import {
    PageSeo,
    useCurrentStory,
    useNewsroomContext,
} from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

import { NotificationsBar } from '@/components';
import { ScrollToTopButton } from '@/ui';

import Boilerplate from './Boilerplate';
import Contacts from './Contacts';
import Footer from './Footer';
import Header from './Header';
import SubscribeForm from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    description?: string;
    imageUrl?: string;
    title?: string;
    hasError?: boolean;
}

const CookieConsentBar = dynamic(() => import('./CookieConsentBar'), {
    ssr: false,
});

const noIndex = process.env.VERCEL === '1';

function Layout({ children, description, imageUrl, title, hasError }: PropsWithChildren<Props>) {
    const story = useCurrentStory();
    const { contacts, notifications } = useNewsroomContext();
    const { query, pathname } = useRouter();

    const isSecretUrl = pathname.startsWith('/s/');
    const isPreviewFlag = Object.keys(query).includes('preview');
    const isConfidentialStory = story && story.visibility === Story.Visibility.CONFIDENTIAL;

    const isPreview = isSecretUrl && (isPreviewFlag || !isConfidentialStory);

    const displayedNotifications = useMemo((): Notification[] => {
        if (isPreview) {
            return [
                ...notifications,
                {
                    id: 'preview-warning',
                    type: 'preview-warning',
                    style: Notification.Style.WARNING,
                    title: 'This is a preview with a temporary URL which will change after publishing.',
                    description: '',
                    actions: [],
                },
            ];
        }

        return notifications;
    }, [notifications, isPreview]);

    return (
        <>
            <Analytics />
            <PageSeo
                noindex={noIndex}
                nofollow={noIndex}
                title={title}
                description={description}
                imageUrl={imageUrl}
            />
            <NotificationsBar notifications={displayedNotifications} />
            <CookieConsentBar />
            <div className={styles.layout}>
                <Header hasError={hasError} />
                <main className={styles.content}>
                    {children}
                </main>
                {contacts && <Contacts contacts={contacts} />}
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
            <ScrollToTopButton />
        </>
    );
}

export default Layout;
