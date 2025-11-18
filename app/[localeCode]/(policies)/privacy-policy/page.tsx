import type { Locale } from '@prezly/theme-kit-nextjs';
import { redirect } from 'next/navigation';

import { app, generatePageMetadata } from '@/adapters/server';
import { ContentRenderer } from '@/components/ContentRenderer';
import { PageTitle } from '@/components/PageTitle';
import { BroadcastPreview } from '@/modules/Broadcast';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
    searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata(props: Props) {
    const { localeCode } = await props.params;
    const { policies } = await app().newsroom();
    const { privacy_policy: policy } = policies;

    if ('link' in policy) {
        redirect(policy.link);
    }

    return generatePageMetadata({
        locale: localeCode,
        title: 'Privacy Policy',
        description:
            'We believe in protecting your privacy. This Privacy Policy explains how your information is protected, stored and used.',
    });
}

export default async function StoryPage(props: Props) {
    const { policies } = await app().newsroom();
    const searchParams = await props.searchParams;
    const { privacy_policy: policy } = policies;

    if ('link' in policy) {
        redirect(policy.link);
    }

    const content = JSON.parse(policy.content);

    return (
        <>
            <BroadcastPreview isPreview={Boolean(searchParams.preview)} />
            <PageTitle title="Privacy Policy" />
            <ContentRenderer nodes={content} />
        </>
    );
}
