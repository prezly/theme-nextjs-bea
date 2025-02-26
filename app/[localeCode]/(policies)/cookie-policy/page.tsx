import type { Locale } from '@prezly/theme-kit-nextjs';
import { redirect } from 'next/navigation';

import { app, generatePageMetadata } from '@/adapters/server';
import { ContentRenderer } from '@/components/ContentRenderer';
import { PageTitle } from '@/components/PageTitle';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
}

export async function generateMetadata(props: Props) {
    const { localeCode } = await props.params;
    const { policies } = await app().newsroom();
    const { cookie_policy: policy } = policies;

    if ('link' in policy) {
        redirect(policy.link);
    }

    return generatePageMetadata({
        locale: localeCode,
        title: 'Cookie Policy',
        description:
            'We believe in protecting your privacy. This Cookie Policy explains how your information is protected, stored and used.',
    });
}

export default async function StoryPage() {
    const { policies } = await app().newsroom();
    const { cookie_policy: policy } = policies;

    if ('link' in policy) {
        redirect(policy.link);
    }

    const content = JSON.parse(policy.content);

    return (
        <>
            <PageTitle title="Cookie Policy" />
            <ContentRenderer nodes={content} />
        </>
    );
}
